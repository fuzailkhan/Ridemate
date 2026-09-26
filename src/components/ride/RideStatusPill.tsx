import React from 'react';
import { Badge, BadgeTone } from '@/components/ui';
import type { RideStatus } from '@/types/models';

const STATUS_CONFIG: Record<RideStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  published: { label: 'Upcoming', tone: 'accent' },
  live: { label: 'Live now', tone: 'success' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'danger' }
};

export function RideStatusPill({ status }: { status: RideStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge label={config.label} tone={config.tone} />;
}
