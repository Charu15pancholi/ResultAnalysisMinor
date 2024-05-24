# pip install pypdf
# pip install tabula-py

# importing required modules 
from pypdf import PdfReader 
import pandas as pd
import json

# creating a pdf reader object 
reader = PdfReader('example.pdf') 

# printing number of pages in pdf file 
print(len(reader.pages)) 

# getting a specific page from the pdf file 
page = reader.pages[0] 

# extracting text from page 
text = page.extract_text() 
print(text) 


# Import Module 
import tabula 

# Read PDF File 
# this contain a list 
df = tabula.read_pdf('example.pdf', pages = 1)[0] 

# Convert into Excel File 
df.to_csv('test.csv',errors="ignore")


# extracting text from page 
text = page.extract_text() 

lines = text.split('\n')

data = {
    "Name": lines[1] + " " + lines[2],
    "Roll no.": lines[5],
    "Course": lines[7],
    "Branch": lines[9],
    "Semester": lines[11],
    "Status": lines[13],
    "Result": lines[-3],
    "SGPA": lines[-2],
    "CGPA": lines[-1],
    "Subjects": []
}

i = 20
while i < len(lines) - 5:
    if lines[i].startswith("CSIT"):
        subject = {
            "Subject": lines[i] + " " + lines[i+1],
            "Total Credit": lines[i+2],
            "Earned Credit": lines[i+3],
            "Grade": lines[i+4]
        }
        i += 5
    else:
        subject = {
            "Subject": lines[i],
            "Total Credit": lines[i+1],
            "Earned Credit": lines[i+2],
            "Grade": lines[i+3]
        }
        i += 4
    # Check if "Total Credit" is a number
    if subject["Total Credit"].isdigit():
        data["Subjects"].append(subject)

# Convert the dictionary to a JSON string
json_data = json.dumps(data, indent=4)

# Write the JSON string to a file
with open('data.json', 'w') as f:
    f.write(json_data)

# Convert the data to a DataFrame
df = pd.json_normalize(data, 'Subjects', ['Name', 'Roll no.', 'Course', 'Branch', 'Semester', 'Status', 'Result', 'SGPA', 'CGPA'])

# Write the DataFrame to an Excel file
df.to_excel('data.xlsx', index=False)