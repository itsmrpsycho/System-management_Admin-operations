# System Management: Admin Operations

Sannidhya Gupta - 2021112012, Vinkesh Bansal - 2021102020

### Software Requirements Specification (SRS) Document

# a) Overview

Effective system management is crucial for organizations like Data Foundation Systems to maintain and optimize their operations. Our project aims to develop a comprehensive web application that empowers system administrators to streamline their tasks related to dataset and model management while ensuring version control.

The project focuses on building an intuitive and user-friendly web application accessible to system administrators. This interface will facilitate efficient navigation and interaction. The web application will enable system administrators to import datasets into the system, and also export them. This functionality ensures seamless data integration and exchange with external systems. The project will implement version control mechanisms for datasets and models. Administrators can compare versions which ensures data and model integrity throughout their lifecycle.

The project would contain a web application, with most of its functions being in the administrative processes. The admin would be required to log in/ sign up to the application, and then on verification of credentials, they can perform the following operations related to data handling:

![dfs_srs.png](./dfs_srs.png)

---

# b) System Requirements

- The project will be developed to be compatible with different platforms and devices, enabling administrators to access and manage system resources from anywhere using the web application.
- The system will be designed with scalability in mind, allowing it to handle large datasets and models efficiently. This ensures that the application remains viable as data volumes grow.
- Data Integrity: Data import/export, dataset, and model deletion/hiding operations should maintain data integrity without corruption or loss.
- Security: Adequate access controls and security measures should be in place to prevent unauthorized access to sensitive datasets and models.
- Well Written Code: code should be clear, organized, and efficient, adhering to coding standards and best practices, making it understandable to other developers, maintainable over time, and less prone to errors. It's characterized by meaningful variable names, appropriate comments, modular design, and minimal complexity.

---

# c) Project Deliverables

- **Login Page**
- ****************Admin Dashboard****************
- ********Version Control********
- ************************************************************Data importing and exporting************************************************************
- ****************************************************************************Data verification system with metadata****************************************************************************
- ****************************Pipeline to upload data to MinIO Bucket for public listing****************************

Primary features in detail:

- Importing or exporting a JSON based package of a dataset and properly updating its versions.
- Importing or exporting a JSON based package of a model and properly updating its versions.
- Verification of the dataset to be uploaded with the metadata provided along with it and displaying error messages if anomalies obtained / incorrect form of data provided.
- Delete / Hide challenges. Hide a dataset or make access private post challenge.
- Security/privacy operation of deleting/hiding a dataset or a model along with its versions.

---