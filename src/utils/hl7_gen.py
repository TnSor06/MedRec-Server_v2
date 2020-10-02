from hl7apy.core import Message, Segment, Field
from datetime import datetime
from sys import argv
import json
data = json.loads(argv[1])
data_type = argv[2]

country_code = str(data['patient']['country']['countryCode'])
principal_lang = data['patient']['principleLanguage']
last_name = data['patient']['user']['lastName']
first_name = data['patient']['user']['firstName']
middle_name = data['patient']['user']['middleName']
mother_name = data['patient']['motherName']
kin_patient_id = data['patient']['cpId']['cpPatientId']['patientId'] if data['patient']['cpId'] else ""
kin_last_name = data['patient']['cpId']['cpPatientId']['user']['lastName'] if data['patient']['cpId'] else ""
kin_first_name = data['patient']['cpId']['cpPatientId']['user']['firstName'] if data['patient']['cpId'] else ""
kin_middle_name = data['patient']['cpId']['cpPatientId']['user']['middleName'] if data['patient']['cpId'] else ""
kin_marital_status = data['patient']['cpId']['cpPatientId']['maritalStatus'] if data['patient']['cpId'] else ""
relationship = data['patient']['cpId']['cpPatientRelation'] if data['patient']['cpId'] else ""
kin_address = data['patient']['cpId']['cpPatientId']['address'] if data['patient']['cpId'] else ""
kin_phone_no = data['patient']['cpId']['cpPatientId']['contact1'] if data['patient']['cpId'] else ""
kin_biz_phone_no = data['patient']['cpId']['cpPatientId']['contact2'] if data['patient']['cpId'] else ""
# kin_job_title = 'AGM Finance'
# kin_organization = 'MSETCL'
kin_sex = data['patient']['cpId']['cpPatientId']['user']['sex'] if data['patient']['cpId'] else ""
kin_religion = data['patient']['cpId']['cpPatientId']['religion'] if data['patient']['cpId'] else ""
kin_citizenship = str(data['patient']['cpId']['cpPatientId']['country']['countryCode']) if data['patient']['cpId'] else ""
kin_mother_name = data['patient']['cpId']['cpPatientId']['motherName'] if data['patient']['cpId'] else ""
kin_job_status = data['patient']['cpId']['cpPatientId']['socioEcoStatus'] if data['patient']['cpId'] else "" # CP -> socioEcoStatus
kin_aadhaar_no = data['patient']['cpId']['cpPatientId']['aadharNo'] if data['patient']['cpId'] else ""
kin_primary_lang = data['patient']['cpId']['cpPatientId']['primaryLanguage'] if data['patient']['cpId'] else ""
kin_dob = data['patient']['cpId']['cpPatientId']['user']['dob'] if data['patient']['cpId'] else ""
dob = data['patient']['user']['dob']
sex = data['patient']['user']['sex']
contact_no_1 = data['patient']['contact1']
contact_no_2 = data['patient']['contact2']
marital_status = data['patient']['maritalStatus']
religion = data['patient']['religion']
practitioner_id = data['medicalPractitioner']['mpId']

event_code = 'ADT'
event_reason = 'Admit'
case_id = data['caseId'] if data_type == 'case' else data['case']['caseId']
danger_code = "{}-{}".format(data['icdCode']
                             ['icdCode'], data['icdSubCode']['icdSubCode']) if data_type == 'case' else "{}-{}".format(data['case']['icdCode']
                             ['icdCode'], data['case']['icdSubCode']['icdSubCode'])

obx_codes = ['1', '2', '3', '4', '5', '6']
obx_units = ['mm of HG', 'mm of HG', 'beats per minute', 'breaths per minute', 'cm', 'kg']

records = []
if data_type == 'case':
    for each in data['patientRecord']:
        record = {}
        record['record_id'] = each['recordId']
        record['timestamp'] = each['createdAt']
        record['obx_test']= [each['cevsSp'], each['cevsDp'], each['cePr'], each['ceRr'], each['ceHeight'], each['ceWeight']]
        records.append(record)
else:
    record = {}
    record['record_id'] = data['recordId']
    record['timestamp'] = data['createdAt']
    record['obx_test']= [data['cevsSp'], data['cevsDp'], data['cePr'], data['ceRr'], data['ceHeight'], data['ceWeight']]
    records.append(record)
    



class HL7_Generator:
    def __init__(self):
        self.m = Message()

    def generate_MSH(self):

        """**********MSH Segment**********
        List of fields utilized in this segment :
        Sr. No. | Field Sequence Number | Field Name   
            1   |       17              | Country Code
            2   |       19              | Principal Language Used"""

        # assign values to fields in MSH Segment
        self.m.msh.msh_17 = country_code
        self.m.msh.msh_19 = principal_lang

    def generate_EVN(self):

        """
        **********EVN Segment**********
        List of fields utilized in this segment :
        Sr. No. | Field Sequence Number | Field Name   
            1   |       1               | Event Code
            2   |       6               | Event Occured
        """

        # assign values to fields in EVN Segment
        self.m.evn.evn_1 = event_code
        self.m.evn.evn_2 = self.m.msh.msh_7
        self.m.evn.evn_6 = event_reason

    def generate_PID(self):

        """
        **********PID Segment**********
        List of fields utilized in this segment :
        Sr. No. | Field Sequence Number |   Field Name   
            1   |       5               | Name (Last Name, First Name, Middle Name)
            2   |       6               | Mother's Maiden Name
            3   |       7               | Date of Birth
            4   |       8               | Sex
            5   |       12              | Country Code
            6   |       13              | Contact Numbers (Contact No. 1, Contact No. 2)
            7   |       16              | Marital Status
            8   |       17              | Religion
        """

        # assign values to fields in PID Segment
        self.m.pid.pid_5.pid_5_1 = last_name
        self.m.pid.pid_5.pid_5_2 = first_name
        self.m.pid.pid_5.pid_5_3 = middle_name
        self.m.pid.pid_6 = mother_name
        self.m.pid.pid_7 = dob
        self.m.pid.pid_8 = sex
        self.m.pid.pid_12 = country_code
        self.m.pid.pid_13.pid_13_1 = contact_no_1
        self.m.pid.pid_13.pid_13_2 = contact_no_2
        self.m.pid.pid_16 = marital_status
        self.m.pid.pid_17 = religion

    def generate_OBX(self):

        """
        **********OBX Segment********** 
        Generate a separate OBX Segement for each of the following observations :
        Sr. No. | Field Sequence Number |   Field Description   
            1   |       1               |   Observation Sequence ID   
            2   |       3               |   Observation Identifier (Observation Sequence ID, Observation Name)
            3   |       5               |   Observation Value
            4   |       6               |   Units
            4   |       14              |   Observation Timestamp
        """

        # date_time = datetime.fromtimestamp(timestamp)
        # d = date_time.strftime("\'%Y-%m-%d %H:%M:%S\' UTC")

        for each in records:
            for i in range(len(obx_codes)):
                obx = Segment('OBX')
                obx.obx_1 = each['record_id']
                obx.obx_3 = obx_codes[i]
                obx.obx_5 = str(each['obx_test'][i])
                obx.obx_6 = obx_units[i]
                obx.obx_14 = each['timestamp']
                self.m.add(obx)


    def generate_NK1(self):
        self.m.nk1.nk1_1 = kin_patient_id
        self.m.nk1.nk1_2.nk1_2_1 = kin_last_name
        self.m.nk1.nk1_2.nk1_2_2 = kin_first_name
        self.m.nk1.nk1_2.nk1_2_3 = kin_middle_name
        self.m.nk1.nk1_3 = relationship
        self.m.nk1.nk1_4 = kin_address
        self.m.nk1.nk1_5 = kin_phone_no
        self.m.nk1.nk1_6 = kin_biz_phone_no
        # self.m.nk1.nk1_10 = kin_job_title
        # self.m.nk1.nk1_13 = kin_organization
        self.m.nk1.nk1_14 = kin_marital_status
        self.m.nk1.nk1_15 = kin_sex
        self.m.nk1.nk1_16 = kin_dob
        self.m.nk1.nk1_19 = kin_citizenship
        self.m.nk1.nk1_20 = kin_primary_lang
        self.m.nk1.nk1_25 = kin_religion
        self.m.nk1.nk1_26 = kin_mother_name
        self.m.nk1.nk1_27 = country_code
        self.m.nk1.nk1_34 = kin_job_status
        self.m.nk1.nk1_37 = kin_aadhaar_no

    def generate_DG1(self):
        self.m.dg1.dg1_1 = case_id
        self.m.dg1.dg1_2 = 'ICD'
        self.m.dg1.dg1_3 = danger_code
        self.m.dg1.dg1_16 = practitioner_id

    def to_hl7(self):
        # f = open('er7.txt','w')
        self.generate_MSH()
        self.generate_EVN()
        self.generate_PID()
        self.generate_OBX() 
        self.generate_NK1()
        self.generate_DG1()
        for child in self.m.children:
            # f.write(child.to_er7() + '\n')
            print(child.to_er7())

gen = HL7_Generator()
gen.to_hl7()


