import type { VerificationStatus, VolunteerFieldStatus, DisasterStatus } from '@/types';

interface StatusBadgeProps {
  status: string;
  type?: 'verification' | 'field' | 'disaster' | 'generic';
}

const verificationMap: Record<VerificationStatus, { label: string; className: string }> = {
  pending: { label: 'Menunggu', className: 'status-badge-pending' },
  approved: { label: 'Terverifikasi', className: 'status-badge-approved' },
  rejected: { label: 'Ditolak', className: 'status-badge-rejected' },
};

const fieldMap: Record<VolunteerFieldStatus, { label: string; className: string }> = {
  siaga: { label: 'Siaga', className: 'status-badge-siaga' },
  bertugas: { label: 'Bertugas', className: 'status-badge-bertugas' },
  selesai: { label: 'Selesai', className: 'status-badge-selesai' },
};

const disasterMap: Record<DisasterStatus, { label: string; className: string }> = {
  aktif: { label: 'Aktif', className: 'status-badge-bertugas' },
  tanggap_darurat: { label: 'Tanggap Darurat', className: 'status-badge-pending' },
  pemulihan: { label: 'Pemulihan', className: 'status-badge-siaga' },
  selesai: { label: 'Selesai', className: 'status-badge-selesai' },
};

export function StatusBadge({ status, type = 'generic' }: StatusBadgeProps) {
  let config = { label: status, className: 'status-badge bg-muted text-muted-foreground' };

  if (type === 'verification' && status in verificationMap) {
    config = verificationMap[status as VerificationStatus];
  } else if (type === 'field' && status in fieldMap) {
    config = fieldMap[status as VolunteerFieldStatus];
  } else if (type === 'disaster' && status in disasterMap) {
    config = disasterMap[status as DisasterStatus];
  }

  return <span className={config.className}>{config.label}</span>;
}
