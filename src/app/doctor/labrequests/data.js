export const  data = [
  {
    testType: "Blood Test",
    testTypeID: 1,
    priority: "High",
    expectedDate: "2024-08-15",
    patientName: "John Doe",
    patientID: 101,
    status: "Requested"
  },
  {
    testType: "X-Ray",
    testTypeID: 2,
    priority: "Medium",
    expectedDate: "2024-08-17",
    patientName: "Jane Smith",
    patientID: 102,
    status: "Completed"
  },
  {
    testType: "MRI Scan",
    testTypeID: 3,
    priority: "Low",
    expectedDate: "2024-08-20",
    patientName: "Alice Johnson",
    patientID: 103,
    status: "Rejected"
  },
  {
    testType: "Ultrasound",
    testTypeID: 4,
    priority: "High",
    expectedDate: "2024-08-14",
    patientName: "Bob Brown",
    patientID: 104,
    status: "Requested"
  },
  {
    testType: "CT Scan",
    testTypeID: 5,
    priority: "Medium",
    expectedDate: "2024-08-16",
    patientName: "Charlie Davis",
    patientID: 105,
    status: "Completed"
  }
  ];

  export const imagingData = [
    {
      imagingType: "CT Scan",
      patientName: "John Doe",
      patientID: 101,
      status: "Requested",
      report: true
    },
    {
      imagingType: "X-Ray",
      patientName: "Jane Smith",
      patientID: 102,
      status: "Completed",
      report: true
    },
    {
      imagingType: "MRI Scan",
      patientName: "Alice Johnson",
      patientID: 103,
      status: "Rejected",
      report: false
    },
    {
      imagingType: "Ultrasound",
      patientName: "Bob Brown",
      patientID: 104,
      status: "Requested",
      report: false
    },
    {
      imagingType: "CT Scan",
      patientName: "Charlie Davis",
      patientID: 105,
      status: "Completed",
      report: true
    }
  ]
