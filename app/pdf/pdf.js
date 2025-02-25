"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styling untuk PDF
const styles = StyleSheet.create({
    page: { flexDirection: "column", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
    text: { fontSize: 16, fontWeight: "bold", },
    amount: { fontSize: 16, fontWeight: "bold", color: "green" },
    date: { fontSize: 10, color: "gray", textAlign: "right" },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 0.5, marginBottom: 10, alignSelf: "center" },
    tableRow: { flexDirection: "row" },
    tableCellHeader: { 
        flex: 1, 
        fontSize: 10, 
        fontWeight: "bold", 
        padding: 2.5, 
        borderStyle: "solid", 
        borderWidth: 0.5,
        backgroundColor: "#f0f0f0",
        textAlign: "center"
    },
    tableCell: { flex: 1, fontSize: 10, padding: 2.5, borderStyle: "solid", borderWidth: 0.5, textAlign: "center" }
});

const MyDocument = ({ data1, data2, data3 }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                <Text style={styles.title}>Laporan Keuangan Hari Ini</Text>
            </View>

            <View style={styles.summaryRow}>
            <Text style={styles.text}>Jumlah Pemasukan: <Text style={styles.amount}>{data2.total_pemasukan.toLocaleString()}</Text></Text>
                <Text style={styles.date}>Tanggal: {data2.tanggal}</Text>
            </View>

            {/* Tabel Data1 */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Nama</Text>
                    <Text style={styles.tableCellHeader}>Kategori</Text>
                    <Text style={styles.tableCellHeader}>Item</Text>
                    <Text style={styles.tableCellHeader}>Jumlah</Text>
                </View>
                {data1.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.name}</Text>
                        <Text style={styles.tableCell}>{item.category}</Text>
                        <Text style={styles.tableCell}>{item.item}</Text>
                        <Text style={styles.tableCell}>Rp {item.jumlah_pemasukan.toLocaleString()}</Text>
                    </View>
                ))}
            </View>

            {/* Tabel Data3 */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Nama</Text>
                    <Text style={styles.tableCellHeader}>Stok Saat Ini</Text>
                    <Text style={styles.tableCellHeader}>Stok Awal</Text>
                    <Text style={styles.tableCellHeader}>Jumlah Masuk</Text>
                    <Text style={styles.tableCellHeader}>Jumlah Habis</Text>
                </View>
                {data3.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.name}</Text>
                        <Text style={styles.tableCell}>{item.stock} / {item.dose}</Text>
                        <Text style={styles.tableCell}>{item.initial_stock} / {item.dose}</Text>
                        <Text style={styles.tableCell}>{item.final_stock} / {item.dose}</Text>
                        <Text style={styles.tableCell}>{item.out_stock} / {item.dose}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default MyDocument;