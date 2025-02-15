import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12 },
    container: {
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottom: "1px solid #E5E7EB",
        backgroundColor: "#F9FAFB",
    },
    title: { fontSize: 14, fontWeight: "bold", color: "#111827" },
    value: { fontSize: 12, color: "#374151" },
});

const MyPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.container}>
                {data.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.title}>{item.label}</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default MyPDF;
