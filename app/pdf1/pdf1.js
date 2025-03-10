"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica", color: "#333" },
    header: { textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    summary: { marginBottom: 20, padding: 12, backgroundColor: "#f5f5f5", borderRadius: 6 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    summaryText: { fontSize: 12, fontWeight: "bold" },
    summaryValue: { fontSize: 16, fontWeight: "bold", color: "#006400" },
    sectionTitle: { fontSize: 14, fontWeight: "bold", marginTop: 10, marginBottom: 5, borderBottom: "1px solid #ddd", paddingBottom: 2 },
    table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#ddd", borderRadius: 4, overflow: "hidden" },
    row: { flexDirection: "row", borderBottom: "1px solid #ddd", backgroundColor: "#fff" },
    headerRow: { backgroundColor: "#f0f0f0", fontSize: 12, fontWeight: "bold" }, 
    cellHeader: { flex: 1, padding: 6, textAlign: "center", fontWeight: "bold" },
    cell: { flex: 1, padding: 4, textAlign: "center", fontSize: 10 }, 
})

const MyDocument = ({ data2, data3, role }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Laporan Bulanan - {data2.bulan}</Text>

            {/* Ringkasan Pemasukan */}
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Total Pemasukan:</Text>
                    <Text style={styles.summaryValue}>Rp{(Number(data2?.total_pemasukan) || 0).toLocaleString()}</Text>
                </View>
            </View>

            {/* Total Terjual */}
            <Text style={styles.sectionTitle}>Total Terjual</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.cellHeader}>Kebab</Text>
                    <Text style={styles.cellHeader}>Burger</Text>
                    <Text style={styles.cellHeader}>Minuman</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>{data2.total_kebab || 0}</Text>
                    <Text style={styles.cell}>{data2.total_burger || 0}</Text>
                    <Text style={styles.cell}>{data2.total_minuman || 0}</Text>
                </View>
            </View>

            <View style={{ marginTop: 10 }} />

            {role === "admin" && (
                <>
                    <Text style={styles.sectionTitle}>Detail Harga Stok Bahan</Text>
                    <View style={styles.table}>
                        <View style={[styles.row, styles.headerRow]}>
                            <Text style={styles.cellHeader}>Nama</Text>
                            <Text style={styles.cellHeader}>Harga</Text>
                            <Text style={styles.cellHeader}>Harga Masuk</Text>
                            <Text style={styles.cellHeader}>Harga Keluar</Text>
                            <Text style={styles.cellHeader}>Selisih</Text>
                        </View>
                        {data3?.map((item, index) => (
                            <View key={index} style={styles.row}>
                                <Text style={styles.cell}>{item.name}</Text>
                                <Text style={styles.cell}>Rp{item.price.toLocaleString()}</Text>
                                <Text style={styles.cell}>Rp{item.harga_masuk.toLocaleString()}</Text>
                                <Text style={styles.cell}>Rp{item.harga_keluar.toLocaleString()}</Text>
                                <Text style={styles.cell}>Rp{item.selisih.toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </Page>
    </Document>
)

export default MyDocument