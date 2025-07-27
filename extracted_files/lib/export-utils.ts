export const exportToExcel = (data: any[], filename: string) => {
  // Create CSV content
  const headers = [
    "Kode Bidang",
    "Nama Bidang",
    "Kode Standar",
    "Kode Kegiatan",
    "Nama Kegiatan",
    "Deskripsi",
    "Sumber Dana",
    "TW 1",
    "TW 2",
    "TW 3",
    "TW 4",
    "Total",
    "Tahun",
    "Status",
  ]

  const csvContent = [
    headers.join(","),
    ...data.map((item) =>
      [
        item.kode_bidang || "",
        `"${item.rkas_bidang?.nama_bidang || ""}"`,
        item.kode_standar || "",
        item.kode_giat || "",
        `"${item.nama_giat || ""}"`,
        `"${item.subtitle || ""}"`,
        item.kode_dana || "",
        item.tw1 || 0,
        item.tw2 || 0,
        item.tw3 || 0,
        item.tw4 || 0,
        (item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0),
        item.tahun || "",
        item.status || "",
      ].join(","),
    ),
  ].join("\n")

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToPDF = (data: any[], title: string) => {
  // Simple PDF export using window.print
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .currency { text-align: right; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>
            <th>Kode Bidang</th>
            <th>Nama Kegiatan</th>
            <th>TW 1</th>
            <th>TW 2</th>
            <th>TW 3</th>
            <th>TW 4</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item) => `
            <tr>
              <td>${item.kode_bidang || ""}</td>
              <td>${item.nama_giat || ""}</td>
              <td class="currency">${(item.tw1 || 0).toLocaleString("id-ID")}</td>
              <td class="currency">${(item.tw2 || 0).toLocaleString("id-ID")}</td>
              <td class="currency">${(item.tw3 || 0).toLocaleString("id-ID")}</td>
              <td class="currency">${(item.tw4 || 0).toLocaleString("id-ID")}</td>
              <td class="currency">${((item.tw1 || 0) + (item.tw2 || 0) + (item.tw3 || 0) + (item.tw4 || 0)).toLocaleString("id-ID")}</td>
              <td>${item.status || ""}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}
