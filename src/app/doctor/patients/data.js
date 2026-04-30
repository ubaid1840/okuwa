export const  data = [
  {
    patientName: "John Doe",
    patientID: "P001",
    gender: "Male",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    dob: "1990-01-15"
  },
  {
    patientName: "Jane Smith",
    patientID: "P002",
    gender: "Female",
    email: "janesmith@example.com",
    phoneNumber: "987-654-3210",
    dob: "1985-07-20"
  },
  {
    patientName: "Alice Johnson",
    patientID: "P003",
    gender: "Female",
    email: "alicejohnson@example.com",
    phoneNumber: "555-123-4567",
    dob: "1992-04-10"
  },
  {
    patientName: "Robert Brown",
    patientID: "P004",
    gender: "Male",
    email: "robertbrown@example.com",
    phoneNumber: "444-321-6789",
    dob: "1988-09-05"
  }
  ];

  export const medicalRecordData = [
    {
      date: "20 Mar 2024",
      diagnosis: "Influenza due to certain identified influenza viruses - J09"
    },
    {
      date: "15 Apr 2024",
      diagnosis: "Acute bronchitis - J20"
    },
    {
      date: "10 May 2024",
      diagnosis: "Pneumonia due to Streptococcus pneumoniae - J13"
    },
    {
      date: "25 Jun 2024",
      diagnosis: "Chronic obstructive pulmonary disease - J44"
    },
    {
      date: "30 Jul 2024",
      diagnosis: "Asthma with (acute) exacerbation - J45.901"
    },
    {
      date: "05 Aug 2024",
      diagnosis: "Acute nasopharyngitis [common cold] - J00"
    },
    {
      date: "12 Sep 2024",
      diagnosis: "Acute sinusitis - J01.90"
    }
  ];

  export const medicalReports = [
    {
      date: "10-07-2024",
      type: "CT Scan",
      image: "CTScan_Image1.jpg",
      doctorName: "Dr. Alice Parker",
      doctorType: "Radiologist",
      status: "On Review"
    },
    {
      date: "12-07-2024",
      type: "MRI",
      image: "MRI_Image2.jpg",
      doctorName: "Dr. Robert Thompson",
      doctorType: "Neurologist",
      status: "Completed"
    },
    {
      date: "15-07-2024",
      type: "X-Ray",
      image: "XRay_Image3.jpg",
      doctorName: "Dr. Linda Green",
      doctorType: "Orthopedic Surgeon",
      status: "On Review"
    },
    {
      date: "18-07-2024",
      type: "Ultrasound",
      image: "Ultrasound_Image4.jpg",
      doctorName: "Dr. Michael Adams",
      doctorType: "Obstetrician",
      status: "Completed"
    },
    {
      date: "20-07-2024",
      type: "Radiology",
      image: "Radiology_Image5.jpg",
      doctorName: "Dr. Emma Clark",
      doctorType: "Radiologist",
      status: "On Review"
    }
  ];
  

  export const labTests = [
    {
      testType: "Blood Test",
      testID: "T001",
      expectedDate: "15-08-2024",
      doctorName: "Dr. John Smith",
      doctorType: "General Practitioner",
      status: "Requested"
    },
    {
      testType: "X-Ray",
      testID: "T002",
      expectedDate: "17-08-2024",
      doctorName: "Dr. Emily Johnson",
      doctorType: "Orthopedic Surgeon",
      status: "Completed"
    },
    {
      testType: "MRI Scan",
      testID: "T003",
      expectedDate: "20-08-2024",
      doctorName: "Dr. Michael Brown",
      doctorType: "Radiologist",
      status: "Requested"
    },
    {
      testType: "Urine Test",
      testID: "T004",
      expectedDate: "22-08-2024",
      doctorName: "Dr. Sarah Lee",
      doctorType: "Urologist",
      status: "Completed"
    },
    {
      testType: "ECG",
      testID: "T005",
      expectedDate: "25-08-2024",
      doctorName: "Dr. David Wilson",
      doctorType: "Cardiologist",
      status: "Requested"
    }
  ];
  