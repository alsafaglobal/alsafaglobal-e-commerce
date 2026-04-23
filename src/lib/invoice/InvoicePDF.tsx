import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const C = {
  dark: '#1a1a2e',
  gold: '#c9a96e',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  border: '#e5e7eb',
  text: '#1f2937',
  white: '#ffffff',
  mutedWhite: '#9ca3af',
};

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: C.text, paddingBottom: 80 },
  header: { backgroundColor: C.dark, padding: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'column' },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  companyName: { color: C.gold, fontSize: 22, fontFamily: 'Helvetica-Bold' },
  tagline: { color: C.mutedWhite, fontSize: 11, marginTop: 4 },
  invoiceTitle: { color: C.white, fontSize: 20, fontFamily: 'Helvetica-Bold' },
  invoiceMeta: { color: C.mutedWhite, fontSize: 10, marginTop: 3 },
  body: { paddingHorizontal: 28, paddingTop: 22 },
  sectionLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gold, marginBottom: 8, paddingBottom: 4, borderBottom: 1, borderBottomColor: C.gold },
  billToRow: { flexDirection: 'row', marginBottom: 5 },
  billToKey: { color: C.gray, width: 55 },
  billToVal: { flex: 1 },
  boldText: { fontFamily: 'Helvetica-Bold' },
  divider: { borderBottom: 1, borderBottomColor: C.border, marginVertical: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: C.lightGray, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 3 },
  tableHeaderCell: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: C.gray },
  tableRow: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 9, borderBottom: 1, borderBottomColor: C.border },
  totalsWrapper: { alignItems: 'flex-end', marginTop: 16 },
  totalsBox: { width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalRowGrand: { flexDirection: 'row', justifyContent: 'space-between', borderTop: 2, borderTopColor: C.gold, paddingTop: 8, marginTop: 4 },
  grandLabel: { fontFamily: 'Helvetica-Bold', fontSize: 13 },
  grandValue: { fontFamily: 'Helvetica-Bold', fontSize: 13, color: C.gold },
  tcSection: { marginHorizontal: 28, marginTop: 20 },
  tcTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 5 },
  tcBulletRow: { flexDirection: 'row', marginBottom: 3 },
  tcDot: { width: 10, color: C.gold, fontSize: 10 },
  tcLine: { flex: 1, color: C.gray, fontSize: 9, lineHeight: 1.5 },
  tcDivider: { borderBottom: 1, borderBottomColor: C.border, marginVertical: 12 },
  policy: { marginHorizontal: 28, marginTop: 16, color: C.gray, fontSize: 9, fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.dark, paddingHorizontal: 28, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerMsg: { color: C.gold, fontSize: 11 },
  footerRight: { alignItems: 'flex-end' },
  footerMeta: { color: C.mutedWhite, fontSize: 9, marginTop: 2 },
});

export interface InvoiceContent {
  company_name: string;
  tagline: string;
  title: string;
  label_bill_to: string;
  col_product: string;
  col_size: string;
  col_qty: string;
  col_unit_price: string;
  col_total: string;
  label_subtotal: string;
  label_tax: string;
  label_delivery: string;
  label_grand_total: string;
  footer_message: string;
  contact_email: string;
  website: string;
  policy_note: string;
  tc_shipping_title: string;
  tc_shipping_body: string;
  tc_refund_title: string;
  tc_refund_body: string;
}

export interface InvoiceOrder {
  orderNumber: string;
  date: string;
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; state?: string; zipCode?: string; country: string };
  items: Array<{ name: string; size?: string; quantity: number; price: number }>;
  totals: { subtotal: number; shipping: number; tax: number; total: number };
  taxRate: number;
  currency: string;
  rate: number;
}

function TCSection({ title, body }: { title: string; body: string }) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <View style={s.tcSection}>
      <Text style={s.tcTitle}>{title}</Text>
      {lines.map((line, i) => (
        <View key={i} style={s.tcBulletRow}>
          <Text style={s.tcDot}>•</Text>
          <Text style={s.tcLine}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

function fmt(aed: number, currency: string, rate: number): string {
  const converted = aed * rate;
  try {
    const number = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(converted);
    return `${currency} ${number}`;
  } catch {
    return `${currency} ${converted.toFixed(2)}`;
  }
}

export function InvoicePDF({ order, content }: { order: InvoiceOrder; content: InvoiceContent }) {
  const { orderNumber, date, customer, shipping, items, totals, taxRate, currency, rate } = order;

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.companyName}>{content.company_name}</Text>
            <Text style={s.tagline}>{content.tagline}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.invoiceTitle}>{content.title}</Text>
            <Text style={s.invoiceMeta}>#{orderNumber}</Text>
            <Text style={s.invoiceMeta}>{date}</Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>

          {/* Bill To */}
          <Text style={s.sectionLabel}>{content.label_bill_to}</Text>
          <View style={s.billToRow}>
            <Text style={[s.billToKey, s.boldText]}>{customer.name}</Text>
          </View>
          <View style={s.billToRow}>
            <Text style={s.billToKey}>Email</Text>
            <Text style={s.billToVal}>{customer.email}</Text>
          </View>
          <View style={s.billToRow}>
            <Text style={s.billToKey}>Phone</Text>
            <Text style={s.billToVal}>{customer.phone}</Text>
          </View>
          <View style={s.billToRow}>
            <Text style={s.billToKey}>Address</Text>
            <Text style={s.billToVal}>
              {shipping.address}{'\n'}
              {shipping.city}{shipping.state ? `, ${shipping.state}` : ''}{shipping.zipCode ? ` ${shipping.zipCode}` : ''}{'\n'}
              {shipping.country}
            </Text>
          </View>

          <View style={s.divider} />

          {/* Items Table */}
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { flex: 3 }]}>{content.col_product}</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5 }]}>{content.col_size}</Text>
            <Text style={[s.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>{content.col_qty}</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5, textAlign: 'right' }]}>{content.col_unit_price}</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5, textAlign: 'right' }]}>{content.col_total}</Text>
          </View>

          {items.map((item, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.boldText, { flex: 3 }]}>{item.name}</Text>
              <Text style={[{ flex: 1.5, color: C.gray }]}>{item.size || '-'}</Text>
              <Text style={[{ flex: 1, textAlign: 'center', color: C.gray }]}>{item.quantity}</Text>
              <Text style={[{ flex: 1.5, textAlign: 'right', color: C.gray }]}>{fmt(item.price, currency, rate)}</Text>
              <Text style={[s.boldText, { flex: 1.5, textAlign: 'right' }]}>{fmt(item.price * item.quantity, currency, rate)}</Text>
            </View>
          ))}

          {/* Totals */}
          <View style={s.totalsWrapper}>
            <View style={s.totalsBox}>
              <View style={s.totalRow}>
                <Text style={{ color: C.gray }}>{content.label_subtotal}</Text>
                <Text>{fmt(totals.subtotal, currency, rate)}</Text>
              </View>
              {totals.shipping > 0 && (
                <View style={s.totalRow}>
                  <Text style={{ color: C.gray }}>{content.label_delivery}</Text>
                  <Text>{fmt(totals.shipping, currency, rate)}</Text>
                </View>
              )}
              {totals.tax > 0 && (
                <View style={s.totalRow}>
                  <Text style={{ color: C.gray }}>{content.label_tax}{taxRate > 0 ? ` (${taxRate}%)` : ''}</Text>
                  <Text>{fmt(totals.tax, currency, rate)}</Text>
                </View>
              )}
              <View style={s.totalRowGrand}>
                <Text style={s.grandLabel}>{content.label_grand_total}</Text>
                <Text style={s.grandValue}>{fmt(totals.total, currency, rate)}</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Terms & Conditions */}
        <View style={[s.tcSection, { marginTop: 24 }]}>
          <Text style={[s.sectionLabel, { marginHorizontal: 0 }]}>Terms & Conditions</Text>
        </View>
        <TCSection title={content.tc_shipping_title} body={content.tc_shipping_body} />
        <View style={{ marginHorizontal: 28 }}><View style={s.tcDivider} /></View>
        <TCSection title={content.tc_refund_title} body={content.tc_refund_body} />

        {/* Policy note */}
        <Text style={s.policy}>{content.policy_note}</Text>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerMsg}>{content.footer_message}</Text>
          <View style={s.footerRight}>
            <Text style={s.footerMeta}>{content.contact_email}</Text>
            <Text style={s.footerMeta}>{content.website}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
