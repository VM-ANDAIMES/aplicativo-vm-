export interface Employee {
  id: string;
  name: string;
  cpf: string;
  role: string;
  department: string;
  admissionDate: string;
  email: string;
  login: string;
  password: string;
  active: boolean;
  phone: string;
  photo?: string;
}

export type DocumentType = 'espelho-ponto' | 'holerite' | 'rescisao';

export interface HRDocument {
  id: string;
  employeeId: string;
  type: DocumentType;
  month: string;
  year: number;
  fileName: string;
  pdfUrl?: string;
  uploadedAt: string;
  signedAt?: string;
  signature?: string;
}

export interface EPI {
  id: string;
  employeeId: string;
  name: string;
  ca: string;
  quantity: number;
  deliveryDate: string;
  expirationDate: string;
  pdfUrl?: string;
  signed: boolean;
  signature?: string;
  signedAt?: string;
}

export interface NR {
  id: string;
  employeeId: string;
  number: string;
  name: string;
  trainingDate: string;
  expirationDate: string;
  status: 'valid' | 'expiring' | 'expired';
  instructor: string;
  cargaHoraria: number;
}

export type ASOType = 'admissional' | 'periodico' | 'retorno' | 'mudanca' | 'demissional';

export interface ASO {
  id: string;
  employeeId: string;
  type: ASOType;
  date: string;
  physician: string;
  crm: string;
  result: 'apto' | 'inapto';
  nextDate?: string;
  fileName?: string;
}

export interface Aviso {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'urgent';
  createdAt: string;
}

export interface Notification {
  id: string;
  employeeId: string | 'all';
  title: string;
  message: string;
  type: 'document' | 'epi' | 'aviso';
  createdAt: string;
  readAt?: string;
  readBy?: string[];
  dismissedBy?: string[];
}

export interface Admin {
  id: string;
  name: string;
  login: string;
  password: string;
  photo?: string;
}

export type UserRole = 'admin' | 'employee';

export interface AuthUser {
  role: UserRole;
  employee?: Employee;
  admin?: Admin;
}
