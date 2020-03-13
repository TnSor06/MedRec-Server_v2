import requests as req
import json
import csv

# Analyzing and sending request
HOST = 'http://localhost:4466'
api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJkZWZhdWx0QGRlZmF1bHQiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTg0MDgwMDc3LCJleHAiOjE1ODQ2ODQ4Nzd9.A-Gq_ONQa42FCSYtfcIkrF5qoVYqa90UolvLeB-8uUE"
headers = {'Authorization': 'Bearer %s' % api_token}

#Add country
with open('./data/country.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    line_count = 0
    for row in csvReader:
        mutation = 'mutation { createCountry(data:{ countryCode:%d countryName:"%s"}){ id }}'%(int(row[0]),row[1])
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print(line_count,ourRequest.status_code)
        line_count = line_count + 1
print("Done")

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
with open('./data/hospital.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    line_count = 5000
    for row in csvReader:
        mutation = 'mutation { createHospital(data:{ hospitalId:"%s" name:"%s" address:"%s" district:"%s" pincode:{ connect:{ pincode: %d }} country:{ connect:{ countryCode: %d }}}){ id }}'%(row[0],row[1],row[2],row[3],int(row[4]),int(row[5]))
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print("HOSPITAL",line_count,ourRequest.text)
        line_count = line_count - 1
        if(line_count==0):
            break
print("Done")

# Add icdCode
with open('./data/icd_codes.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    line_count = 5000
    for row in csvReader:
        mutation = 'mutation { createICDCode(data:{ icdCode:"%s" commonName:"%s" }){ id }}'%(row[0],row[1])
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print(line_count,ourRequest.text)
        line_count = line_count - 1
        if(line_count==0):
            break
print("Done")

# Add icdSubCode
with open('./data/icd_sub_codes.csv', mode='r') as csv_file:
    csvReader = csv.reader(csv_file)
    line_count = 10000
    for row in csvReader:
        mutation = 'mutation { createICDSubCode(data:{ icdSubCode:"%s" scientificName:"%s" icdCode:{ connect:{ icdCode:"%s" } } }){ id }}'%(str(row[0]),str(row[1]),str(row[2]))
        json = { 'query' :  mutation}
        ourRequest = req.post(url=HOST, json=json, headers=headers)
        print("ICDSUBCODE",line_count,ourRequest.text)
        line_count = line_count - 1
        if(line_count==0):
            break
print("Done")
