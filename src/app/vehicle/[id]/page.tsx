'use server';
import { Suspense } from 'react';
import VehicleDetailClient from './VehicleDetailClient';

export default async function VehiclePage(props: any) {
  const { params } = (await props) as { params: { id: string } };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleDetailClient initialVehicleId={params.id} />
    </Suspense>
  );
}