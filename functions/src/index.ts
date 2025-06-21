import { onCall } from 'firebase-functions/v2/https';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();
const db = admin.firestore();

const PUSHER_BEAMS_INSTANCE_ID = '3edf71c5-d3e0-471a-aaa5-ebe35be280ba';
const PUSHER_BEAMS_SECRET_KEY = '2F4FB361366FD9BFF56C6A64505291736F26B98B79CBF460699E5E7616B44154';

export const notifyClientWhenReady = onDocumentUpdated(
  'tickets/{ticketId}',
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();

    if (!before || !after) return;

    if (before.status !== 'assigned' && after.status === 'assigned') {
      const token = after.client_token;
      if (!token) return;

      const response = await fetch(
        `https://${PUSHER_BEAMS_INSTANCE_ID}.pushnotifications.pusher.com/publish_api/v1/instances/${PUSHER_BEAMS_INSTANCE_ID}/publishes/interests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PUSHER_BEAMS_SECRET_KEY}`,
          },
          body: JSON.stringify({
            interests: [token],
            web: {
              notification: {
                title: 'سيارتك جاهزة',
                body: `سيتم تجهيز سيارتك خلال ${after.eta_minutes ?? '--'} دقيقة.`,
                deep_link: `https://i-valet.app/ticket/${event.params.ticketId}`,
              },
            },
          }),
        }
      );

      const raw = await response.text();

      if (!response.ok) {
        logger.error('❌ Push notification failed', {
          status: response.status,
          raw,
          ticketId: event.params.ticketId,
        });
        return;
      }

      try {
        const result = JSON.parse(raw);
        logger.info('✅ Notification sent successfully', result);
      } catch (err) {
        logger.error('❌ JSON parse error from Pusher response', {
          error: (err as Error).message,
          raw,
        });
      }
    }
  }
);

export const assignTicketToWorker = onCall(async (request) => {
  const { ticketId, driverId } = request.data;
  await db.collection('tickets').doc(ticketId).update({
    assigned_worker: driverId,
    status: 'assigned',
    assigned_at: admin.firestore.Timestamp.now(),
  });
  return { success: true };
});

export const completeTicket = onCall(async (request) => {
  const { ticketId } = request.data;
  await db.collection('tickets').doc(ticketId).update({
    status: 'completed',
    completed_at: admin.firestore.Timestamp.now(),
  });
  return { success: true };
});

export const cancelTicket = onCall(async (request) => {
  const { ticketId } = request.data;
  await db.collection('tickets').doc(ticketId).update({
    status: 'cancelled',
    cancelled_at: admin.firestore.Timestamp.now(),
  });
  return { success: true };
});

export const expireUnscannedTickets = onSchedule('every 5 minutes', async () => {
  const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);
  const snapshot = await db
    .collection('tickets')
    .where('status', '==', 'new')
    .where('created_at', '<=', cutoff)
    .get();

  const batch = db.batch();
  snapshot.forEach((doc) => {
    batch.update(doc.ref, { status: 'expired' });
  });
  await batch.commit();

  logger.info(`✅ Expired ${snapshot.size} tickets`);
});

export const notifyBeforeArrival = onRequest(async (req, res) => {
  try {
    const { clientToken, eta } = req.body;

    if (!clientToken || !eta) {
      res.status(400).send('Missing clientToken or eta');
      return;
    }

    const response = await fetch(
      `https://${PUSHER_BEAMS_INSTANCE_ID}.pushnotifications.pusher.com/publish_api/v1/instances/${PUSHER_BEAMS_INSTANCE_ID}/publishes/interests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PUSHER_BEAMS_SECRET_KEY}`,
        },
        body: JSON.stringify({
          interests: [clientToken],
          web: {
            notification: {
              title: 'تحديث وقت الوصول',
              body: `سيصل موظف خدمة صف السيارات خلال ${eta} دقيقة`,
              deep_link: `https://i-valet.app/ticket/${clientToken}`,
            },
          },
        }),
      }
    );

    const raw = await response.text();

    if (!response.ok) {
      logger.error('❌ Pre-arrival notification failed', {
        status: response.status,
        raw,
        clientToken,
      });
      res.status(response.status).send('Notification failed');
      return;
    }

    const result = JSON.parse(raw);
    logger.info('✅ Pre-arrival alert sent:', result);
    res.status(200).json(result);

  } catch (err) {
    logger.error('❌ notifyBeforeArrival runtime error', {
      error: (err as Error).message,
    });
    res.status(500).send('Server error');
  }
});
