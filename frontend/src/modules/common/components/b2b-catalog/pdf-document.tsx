import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Standard Font
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCOjFwrW2mtmPpwvf_p060.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 20,
  },
  seal: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
    color: '#000000',
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
    paddingLeft: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 40,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
    minHeight: 35,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#fafafa',
    borderBottomColor: '#000000',
    borderBottomWidth: 2,
  },
  tableColHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 5,
  },
  tableCol: {
    fontSize: 10,
    padding: 5,
  },
  col1: { width: '40%' },
  col2: { width: '20%' },
  col3: { width: '20%' },
  col4: { width: '20%', textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#999999',
    marginBottom: 10,
  },
  ctaBox: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 4,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

interface Product {
  title: string;
  handle: string;
  sku?: string;
  variants: any[];
}

const B2BCatalogPDF = ({ products }: { products: Product[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src="/images/seal.png" style={styles.seal} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>B2B Procurement</Text>
          <Text style={styles.subtitle}>Royal Bengal Shrooms Ltd. — Dhaka Unit</Text>
        </View>
      </View>

      {/* Intro */}
      <Text style={styles.sectionTitle}>Scientific Series — Institutional Inventory</Text>
      
      {/* Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableColHeader, styles.col1]}>Product Specification</Text>
          <Text style={[styles.tableColHeader, styles.col2]}>SKU Code</Text>
          <Text style={[styles.tableColHeader, styles.col3]}>Volume/Unit</Text>
          <Text style={[styles.tableColHeader, styles.col4]}>Wholesale Price</Text>
        </View>

        {products.map((product, idx) => (
          product.variants.map((variant, vIdx) => (
            <View style={styles.tableRow} key={`${idx}-${vIdx}`}>
              <Text style={[styles.tableCol, styles.col1]}>{product.title}</Text>
              <Text style={[styles.tableCol, styles.col2]}>{variant.sku || 'N/A'}</Text>
              <Text style={[styles.tableCol, styles.col3]}>{variant.title || 'Standard'}</Text>
              <Text style={[styles.tableCol, styles.col4]}>
                ${((variant.prices?.[0]?.amount || 0) / 100).toFixed(2)}
              </Text>
            </View>
          ))
        ))}
      </View>

      {/* Footer / CTA */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Sovereign Authority: Dhaka Extraction Facility. Digital Audit: RBSL-ACCORD-2024.
        </Text>
        <View style={styles.ctaBox}>
          <Text style={styles.ctaText}>
            For institutional inquiries: procurement@shrooms.limited | +880-DHAKA-UNIT
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default B2BCatalogPDF;
