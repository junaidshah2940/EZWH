# Design Document 


Authors: 

Date:

Version:


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

It is the High Level design for Easy Warehouse application. A three tier architecture has been chosen, and all the classes and connection are reported in the diagram below. A Facade Design Pattern has been chosen, to make easier and more maintainable the code.

![HighLevelDiagram](./schemes/Design/HighLevelDesign.png)

# Low level design

In this paragraph, are designed the Application Logic Tier and the Data Layer Tier.

## Application Logic Tier

![AppTierLowLevel](./schemes/Design/LowLevelDesing/AppLogicTier.png)

## Data Tier

### Order and test model
![OrderLowLevel](./schemes/Design/LowLevelDesing/Orders_Test_LL_diagram.png)

### SKU and Items model
![ItemsLowLevel](./schemes/Design/LowLevelDesing/Items_SKU_Position_LL_design.png)

### User and session model
![UserSessonLowLevel](./schemes/Design/LowLevelDesing/User_session_LL_design.png)

# Verification traceability matrix

|| ManageOrder | ManagePosition | ManageSKUs | ManageItems | ManageSession | ManageUsers | ManageTest |
|---|---|---|---|---|---|---|---|
| FR1 |||||| X ||
| FR2 ||| X |||||
| FR3 || X ||||| X |
| FR4 |||||| X ||
| FR5 | X | X | X |||| X |
| FR6 | X |||||||
| FR7 |||| X ||||

# Verification sequence diagrams 

### Sequence Diagram of Scenario 1-1
![SequenceDiagram1](./schemes/Design/SequenceDiagrams/Scenario1_1.PNG)

### Sequence Diagram of Scenario 2-2
![SequenceDiagram2](./schemes/Design/SequenceDiagrams/Scenario2_2.PNG)

### Sequence Diagram of Scenario 3-1
![SequenceDiagram3](./schemes/Design/SequenceDiagrams/Scenario3_1.PNG)

### Sequence Diagram of Scenario 5-2-1
![SequenceDiagram4](./schemes/Design/SequenceDiagrams/Scenario5_2_1.PNG)

### Sequence Diagram of Scenario 6-1
![SequenceDiagram5](./schemes/Design/SequenceDiagrams/Scenario6_1.PNG)

### Sequence Diagram of Scenario 9-1
![SequenceDiagram6](./schemes/Design/SequenceDiagrams/Scenario9_1.PNG)
