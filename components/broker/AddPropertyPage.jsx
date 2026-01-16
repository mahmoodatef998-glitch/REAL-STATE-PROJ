"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import PropertyForm from '../admin/PropertyForm';

export default function AddPropertyPage() {
  const { isBroker } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(true);

  if (!isBroker()) {
    return (
      <div className="container-x py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-neutral-300">Only brokers can add properties.</p>
      </div>
    );
  }

  const handleFormClose = () => {
    router.push('/broker/dashboard');
  };

  const handleFormSave = () => {
    router.push('/broker/dashboard');
  };

  return (
    <>
      {showForm && (
        <PropertyForm
          property={null}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </>
  );
}

