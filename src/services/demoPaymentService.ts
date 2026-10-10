/**
 * Payment Gateway Service Module
 * Smita Dental Clinic Management System
 * 
 * Implements a clean PaymentGatewayProvider interface for seamless online
 * checkout and electronic tariff settlements.
 */

import { Invoice, DemoPaymentRecord, DemoPaymentMethod, DemoScenario, DemoPaymentStatus } from '../types/clinic';

export interface PaymentGatewayRequest {
  invoiceId: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: DemoPaymentMethod;
  scenario?: DemoScenario;
}

export interface PaymentGatewayResponse {
  success: boolean;
  status: DemoPaymentStatus;
  demoReference: string;
  timestamp: string;
  amount: number;
  currency: 'INR';
  errorMessage?: string;
  record: DemoPaymentRecord;
}

export interface PaymentGatewayProvider {
  processPayment(request: PaymentGatewayRequest, invoice: Invoice): Promise<PaymentGatewayResponse>;
  validateCheckout(invoice: Invoice, patientId: string, requestedAmount: number): { valid: boolean; error?: string };
}

/**
 * Generates an auditable transaction reference
 * Example: TXN-2026-WUHMMNC1
 */
export function generateDemoReference(): string {
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TXN-${new Date().getFullYear()}-${timestampPart}${randomPart}`;
}

class DemoPaymentGatewayServiceImpl implements PaymentGatewayProvider {
  /**
   * Validates checkout rules before launching authorization:
   * 1. Invoice exists and belongs to requesting patient
   * 2. Invoice has outstanding balance > 0
   * 3. Cannot pay more than the balance due
   * 4. Must pay full outstanding balance only (locked amount)
   * 5. Prevents double payment on already-paid invoices
   */
  public validateCheckout(
    invoice: Invoice,
    patientId: string,
    requestedAmount: number
  ): { valid: boolean; error?: string } {
    if (!invoice) {
      return { valid: false, error: 'Invoice record not found.' };
    }

    if (invoice.patientId !== patientId) {
      return { valid: false, error: 'Unauthorized: Invoice does not belong to the active patient.' };
    }

    if (invoice.status === 'paid' || invoice.balanceDue <= 0 || invoice.isDemoPaid) {
      return {
        valid: false,
        error: `Invoice #${invoice.invoiceNumber} is already settled in full. No outstanding payment is due.`
      };
    }

    // Only allow full outstanding balance payment (no custom or excessive amount)
    const tolerance = 0.01;
    if (Math.abs(requestedAmount - invoice.balanceDue) > tolerance) {
      return {
        valid: false,
        error: `Invalid payment amount: Only the full outstanding balance of ₹${invoice.balanceDue.toFixed(2)} can be processed.`
      };
    }

    return { valid: true };
  }

  /**
   * Executes payment gateway processing
   */
  public async processPayment(
    request: PaymentGatewayRequest,
    invoice: Invoice
  ): Promise<PaymentGatewayResponse> {
    const validation = this.validateCheckout(invoice, request.patientId, request.amount);
    if (!validation.valid) {
      throw new Error(validation.error || 'Payment validation failed.');
    }

    // Standard secure authorization response time
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const demoReference = generateDemoReference();
    const timestamp = new Date().toISOString();
    const outcome = request.scenario || 'success';

    if (outcome === 'success') {
      const record: DemoPaymentRecord = {
        id: 'pay-' + Date.now() + Math.random().toString(36).slice(2, 5),
        demoReference,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        patientId: request.patientId,
        patientName: request.patientName,
        amount: request.amount,
        currency: 'INR',
        timestamp,
        paymentMethod: request.paymentMethod,
        status: 'Successful',
        scenarioTested: 'success',
        isDemo: true
      };

      return {
        success: true,
        status: 'Successful',
        demoReference,
        timestamp,
        amount: request.amount,
        currency: 'INR',
        record
      };
    }

    if (outcome === 'failed') {
      const failureReason = 'Transaction declined by customer issuing bank authorization switch.';
      const record: DemoPaymentRecord = {
        id: 'pay-' + Date.now() + Math.random().toString(36).slice(2, 5),
        demoReference,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        patientId: request.patientId,
        patientName: request.patientName,
        amount: request.amount,
        currency: 'INR',
        timestamp,
        paymentMethod: request.paymentMethod,
        status: 'Failed',
        scenarioTested: 'failed',
        failureReason,
        isDemo: true
      };

      return {
        success: false,
        status: 'Failed',
        demoReference,
        timestamp,
        amount: request.amount,
        currency: 'INR',
        errorMessage: failureReason,
        record
      };
    }

    // Cancelled scenario
    const cancelReason = 'Transaction cancelled by customer.';
    const record: DemoPaymentRecord = {
      id: 'pay-' + Date.now() + Math.random().toString(36).slice(2, 5),
      demoReference,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      patientId: request.patientId,
      patientName: request.patientName,
      amount: request.amount,
      currency: 'INR',
      timestamp,
      paymentMethod: request.paymentMethod,
      status: 'Cancelled',
      scenarioTested: 'cancelled',
      failureReason: cancelReason,
      isDemo: true
    };

    return {
      success: false,
      status: 'Cancelled',
      demoReference,
      timestamp,
      amount: request.amount,
      currency: 'INR',
      errorMessage: cancelReason,
      record
    };
  }
}

export const demoPaymentService = new DemoPaymentGatewayServiceImpl();
