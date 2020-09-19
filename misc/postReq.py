import requests as req
import json
import csv

# Analyzing and sending request
HOST = 'http://localhost:4466'
api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJkZWZhdWx0QGRlZmF1bHQiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNjAwNTMyMTI4LCJleHAiOjE2MDExMzY5Mjh9.t9_9Reie-xoTpQCsy_pY3XJXr5JVn1jtbewF9HxZgT4"
headers = {'Authorization': 'Bearer %s' % api_token}
line_count = 0
# #Add country
# with open('./data/country.csv', mode='r') as csv_file:
#     csvReader = csv.reader(csv_file)
#     line_count = 0
#     for row in csvReader:
#         mutation = 'mutation { createCountry(data:{ countryCode:%d countryName:"%s"}){ id }}'%(int(row[0]),row[1])
#         json = { 'query' :  mutation}
#         ourRequest = req.post(url=HOST, json=json, headers=headers)
#         print(line_count,ourRequest.status_code)
#         line_count = line_count + 1
# print("Done")

# # Add region
# with open('./data/region.csv', mode='r') as csv_file:
#     csvReader = csv.reader(csv_file)
#     line_count = 0
#     for row in csvReader:
#         mutation = 'mutation { createRegion(data:{ pincode:%d region:"%s"}){ id }}'%(int(row[0]),row[1])
#         json = { 'query' :  mutation}
#         ourRequest = req.post(url=HOST, json=json, headers=headers)
#         print(line_count,ourRequest.status_code)
#         line_count = line_count + 1
# print("Done")

# # Add hospital
# count = 500
# with open('./data/hospital.csv', mode='r') as csv_file:
#     csvReader = csv.reader(csv_file)
#     line_count = 0
#     for row in csvReader:
#         mutation = 'mutation { createHospital(data:{ hospitalId:"%s" name:"%s" address:"%s" district:"%s" pincode:{ connect:{ pincode: %d }} country:{ connect:{ countryCode: %d }}}){ id }}'%(row[0],row[1],row[2],row[3],int(row[4]),int(row[5]))
#         json = { 'query' :  mutation}
#         ourRequest = req.post(url=HOST, json=json, headers=headers)
#         print("HOSPITAL",line_count,ourRequest.text)
#         line_count = line_count + 1
#         count = count - 1
#         if(count==0):
#             break
# print("Done")

# # Add icdCode
# count = 500
# with open('./data/icd_codes.csv', mode='r') as csv_file:
#     csvReader = csv.reader(csv_file)
#     for row in csvReader:
#         mutation = 'mutation { createICDCode(data:{ icdCode:"%s" commonName:"%s" }){ id }}'%(row[0],row[1])
#         json = { 'query' :  mutation}
#         ourRequest = req.post(url=HOST, json=json, headers=headers)
#         print(line_count,ourRequest.text)
#         count = count - 1
#         if(count==0):
#             break
# print("Done")

# Add icdSubCode
count = 1000
with open('./data/icd_sub_codes.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    for row in csvReader:
        mutation = 'mutation { createICDSubCode(data:{ icdSubCode:"%s" scientificName:"%s" icdCode:{ connect:{ icdCode:"%s" } } }){ id }}'%(str(row[0]),str(row[1]),str(row[2]))
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print("ICDSUBCODE",line_count,ourRequest.text)
        count = count - 1
        if(count==0):
            break
print("Done")
