import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ETAConfiguration = () => {
  const firestore = getFirestoreInstance();

  // State variables for ETA settings and valet parking capacity
  const [defaultEta, setDefaultEta] = useState('');
  const [preAlertMargin, setPreAlertMargin] = useState('');
  const [valetCapacity, setValetCapacity] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetch ETA settings from Firestore
      const docRef = doc(firestore, 'admin_config', 'eta_settings');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setDefaultEta(data.default_eta?.toString() || '');
        setPreAlertMargin(data.pre_alert_margin?.toString() || '');
      }

      // Fetch Valet capacity from Firestore
      const valetRef = doc(firestore, 'admin_config', 'valet_capacity');
      const valetSnap = await getDoc(valetRef);
      if (valetSnap.exists()) {
        const data = valetSnap.data();
        setValetCapacity(data.valet_capacity?.toString() || '');
      }
    };

    // Execute the settings fetch
    fetchSettings();
  }, [firestore]);

  const handleSave = async () => {
    // Update ETA settings in Firestore
    const etaRef = doc(firestore, 'admin_config', 'eta_settings');
    await setDoc(
      etaRef,
      {
        default_eta: parseInt(defaultEta, 10),
        pre_alert_margin: parseInt(preAlertMargin, 10)
      },
      { merge: true }
    );

    // Update valet parking capacity
    const valetRef = doc(firestore, 'admin_config', 'valet_capacity');
    const totalSlots = parseInt(valetCapacity, 10);
    await setDoc(
      valetRef,
      {
        valet_capacity: totalSlots
      },
      { merge: true }
    );

    // Recalculate parking_slots
    const existingSlots = new Set();
    for (let i = 1; i <= totalSlots; i++) {
      const slotRef = doc(firestore, 'parking_slots', `slot_${i}`);
      const slotSnap = await getDoc(slotRef);
      if (slotSnap.exists()) {
        const existingData = slotSnap.data();
        await setDoc(
          slotRef,
          {
            slot_number: i,
            occupied: existingData.occupied || false,
            current_ticket: existingData.current_ticket || '',
            updated_at: new Date()
          },
          { merge: true }
        );
      } else {
        await setDoc(
          slotRef,
          {
            slot_number: i,
            occupied: false,
            current_ticket: '',
            updated_at: new Date()
          },
          { merge: true }
        );
      }
      existingSlots.add(`slot_${i}`);
    }

    // Optional: Clean up extra slots beyond current capacity
    // Not implemented here for safety

    alert('Settings saved and parking slots synced.');
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-white">ETA Configuration</h2>

      {/* Input for Default ETA */}
      <div>
        <Label className="text-white">Default ETA (minutes)</Label>
        <Input
          type="number"
          value={defaultEta}
          onChange={(e) => setDefaultEta(e.target.value)}
          className="mt-1 bg-black/20 text-white border-white/20"
        />
      </div>

      {/* Input for Pre-alert margin */}
      <div>
        <Label className="text-white">Pre-alert Margin (minutes)</Label>
        <Input
          type="number"
          value={preAlertMargin}
          onChange={(e) => setPreAlertMargin(e.target.value)}
          className="mt-1 bg-black/20 text-white border-white/20"
        />
      </div>

      {/* Input for total parking slot capacity */}
      <div>
        <Label className="text-white">Total Valet Parking Slots</Label>
        <Input
          type="number"
          value={valetCapacity}
          onChange={(e) => setValetCapacity(e.target.value)}
          className="mt-1 bg-black/20 text-white border-white/20"
        />
      </div>

      {/* Save Button */}
      <Button className="mt-4" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  );
};

export default ETAConfiguration;
