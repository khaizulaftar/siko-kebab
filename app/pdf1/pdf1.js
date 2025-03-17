import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica", color: "#333" },
    header: { textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    dateRange: { fontSize: 12, textAlign: "center", color: "gray", marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontWeight: "bold", marginTop: 10, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: "#ddd", paddingBottom: 2 },
    table: { display: "table", width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 4, overflow: "hidden" },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", backgroundColor: "#fff" },
    headerRow: { backgroundColor: "#f0f0f0", fontSize: 12, fontWeight: "bold" },
    cellHeader: { flex: 1, padding: 6, textAlign: "center", fontWeight: "bold" },
    cell: { flex: 1, padding: 4, textAlign: "center", fontSize: 10 },
});

const PDFReport = ({ data, startDate, endDate }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Laporan Penjualan</Text>
            <Text style={styles.dateRange}>Periode: {startDate} - {endDate}</Text>

            <Text style={styles.sectionTitle}>Detail History</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.cellHeader}>Nama menu</Text>
                    <Text style={styles.cellHeader}>Kategori</Text>
                    <Text style={styles.cellHeader}>Total item</Text>
                    <Text style={styles.cellHeader}>Jumlah pemasukan</Text>
                </View>
                {data?.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.category}</Text>
                        <Text style={styles.cell}>{item.total_item}</Text>
                        <Text style={styles.cell}>Rp{new Intl.NumberFormat("id-ID").format(Number(item.jumlah_pemasukan) || 0)}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default PDFReport;