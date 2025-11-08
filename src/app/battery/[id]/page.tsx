import { Suspense } from 'react';
import BatteryDetailClient from './BatteryDetailClient';

export default async function BatteryPage(props: any) {
  const { params } = (await props) as { params: { id: string } };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BatteryDetailClient initialBatteryId={params.id} />
    </Suspense>
  );
}