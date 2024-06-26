import pandas as pd

# Read the CSV file
df = pd.read_csv('publications.csv')

# HTML template for each work item
work_item_template = '''
<div class="work-item">
    <a  target="_blank" href="{link}">
        <img src="{image}" alt="Article Image">
        <p class="journal-name">{journal}</p>
        <p class="article-title">{title}</p>
        <p class="publication-date">{date}</p>
    </a>
</div>
'''

# Generate the HTML content
work_items = ""
for index, row in df.iterrows():
    work_items += work_item_template.format(
        link=row['link'],
        image=row['image'],
        journal=row['journal'],
        title=row['title'],
        date=row['date']
    )

# Read the existing index.htm
with open('index.html', 'r') as file:
    index_html = file.read()

# Replace the existing work items section
start_tag = '<section id="work">'
end_tag = '</section>'
start_index = index_html.find(start_tag) + len(start_tag)
end_index = index_html.find(end_tag)

new_index_html = index_html[:start_index] + work_items + index_html[end_index:]

# Write the updated HTML back to index.htm
with open('index.html', 'w') as file:
    file.write(new_index_html)
