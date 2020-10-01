import requests as req
import json
import csv

# Analyzing and sending request
HOST = 'https://medrec-ehr-a9866b93bf.herokuapp.com/prisma-medrec/prod/'
api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJwcmlzbWEtbWVkcmVjQHByb2QiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNjAxNTM2NjQ5LCJleHAiOjE2MDIxNDE0NDl9.mgXtwTNTN_ZLpJm7_-7HAtdS96ZZwf7wHY5p2l5EIgQ"
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

# Add region
with open('./data/region.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    line_count = 0
    for row in csvReader:
        mutation = 'mutation { createRegion(data:{ pincode:%d region:"%s"}){ id }}'%(int(row[0]),row[1])
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print(line_count,ourRequest.status_code)
        line_count = line_count + 1
print("Done")

# Add hospital
count = 1000
with open('./data/hospital.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    line_count = 0
    for row in csvReader:
        mutation = 'mutation { createHospital(data:{ hospitalId:"%s" name:"%s" searchName:"%s" address:"%s" district:"%s" pincode:{ connect:{ pincode: %d }} country:{ connect:{ countryCode: %d }}}){ id }}'%(row[0],row[1],row[1].lower().replace(" ","-"),row[2],row[3],int(row[4]),int(row[5]))
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print("HOSPITAL",line_count,ourRequest.text)
        line_count = line_count + 1
        count = count - 1
        if(count==0):
            break
print("Done")

# Add icdCode
count = 1500
with open('./data/icd_codes.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    for row in csvReader:
        mutation = 'mutation { createICDCode(data:{ icdCode:"%s" commonName:"%s" searchCommonName:"%s" }){ id }}'%(row[0],row[1],row[1].lower().replace(" ","-"))
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print(line_count,ourRequest.text)
        count = count - 1
        if(count==0):
            break
print("Done")

# Add icdSubCode
count = 3000
with open('./data/icd_sub_codes.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    for row in csvReader:
        mutation = 'mutation { createICDSubCode(data:{ icdSubCode:"%s" scientificName:"%s" searchScientificName:"%s" icdCode:{ connect:{ icdCode:"%s" } } }){ id }}'%(str(row[0]),str(row[1]), str(row[1].lower().replace(" ","-")),str(row[2]))
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print("ICDSUBCODE",line_count,ourRequest.text)
        count = count - 1
        if(count==0):
            break
print("Done")
