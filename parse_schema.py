import re

def parse_schema_full(filename, output_file):
    with open(filename, 'r') as f:
        content = f.read()

    # 1. Parse Tables
    tables = {}
    table_pattern = re.compile(r'CREATE TABLE public\.(\w+) \((.*?)\);', re.DOTALL)
    for match in table_pattern.finditer(content):
        t_name = match.group(1)
        columns_block = match.group(2)
        columns = []
        parts = re.split(r',\s*(?![^()]*\))', columns_block.strip())
        for part in parts:
            if part.strip():
                columns.append(part.strip())
        tables[t_name] = {'columns': columns, 'constraints': [], 'policies': [], 'triggers': []}

    # 2. Parse Alter Table Constraints (Primary Keys, Foreign Keys, Unique)
    alter_pattern = re.compile(r'ALTER TABLE ONLY public\.(\w+)\s+ADD CONSTRAINT (\w+) (.*?);', re.DOTALL)
    for match in alter_pattern.finditer(content):
        t_name = match.group(1)
        c_name = match.group(2)
        c_def = match.group(3).replace('\n', ' ').strip()
        if t_name in tables:
            tables[t_name]['constraints'].append(f"{c_name}: {c_def}")

    # 3. Parse Policies (RLS)
    policy_pattern = re.compile(r'CREATE POLICY (.*?) ON public\.(\w+)\s+(.*?);', re.DOTALL)
    for match in policy_pattern.finditer(content):
        p_name = match.group(1).replace('"', '')
        t_name = match.group(2)
        p_def = match.group(3).replace('\n', ' ').strip()
        if t_name in tables:
            tables[t_name]['policies'].append(f"{p_name}: {p_def}")
            
    # 4. Parse Functions
    functions = []
    func_pattern = re.compile(r'CREATE FUNCTION public\.(\w+)\(.*?\).*?AS \$\$(.*?)\$\$;', re.DOTALL)
    for match in func_pattern.finditer(content):
        f_name = match.group(1)
        f_body = match.group(2).strip()
        functions.append({'name': f_name, 'body': f_body})
        
    # 5. Parse Triggers
    trigger_pattern = re.compile(r'CREATE TRIGGER (\w+) (.*?) ON public\.(\w+)\s+(.*?);', re.DOTALL)
    for match in trigger_pattern.finditer(content):
        tr_name = match.group(1)
        tr_timing = match.group(2).replace('\n', ' ').strip()
        t_name = match.group(3)
        tr_action = match.group(4).replace('\n', ' ').strip()
        if t_name in tables:
            tables[t_name]['triggers'].append(f"{tr_name}: {tr_timing} {tr_action}")

    # 6. Parse Views
    views = []
    view_pattern = re.compile(r'CREATE VIEW public\.(\w+) AS (.*?);', re.DOTALL)
    for match in view_pattern.finditer(content):
        v_name = match.group(1)
        v_def = match.group(2).replace('\n', ' ').strip()
        views.append({'name': v_name, 'def': v_def})

    # Generate Markdown
    md = "# Database Schema Analysis Report\n\n"
    md += "This report provides a comprehensive overview of the PostgreSQL database schema for the new C2G Logistics website.\n\n"
    
    md += "## 📊 Tables Overview\n"
    for t_name in sorted(tables.keys()):
        table = tables[t_name]
        md += f"### `{t_name}`\n"
        
        md += "**Columns:**\n"
        md += "| Column | Type / Definition |\n"
        md += "| --- | --- |\n"
        for col in table['columns']:
            col_parts = col.split(' ', 1)
            if len(col_parts) == 2:
                name, definition = col_parts
                definition = definition.replace('\n', ' ').strip()
                md += f"| `{name}` | {definition} |\n"
            else:
                md += f"| | {col} |\n"
        
        if table['constraints']:
            md += "\n**Constraints (PK/FK/Unique):**\n"
            for c in table['constraints']:
                md += f"- `{c}`\n"
                
        if table['policies']:
            md += "\n**Row Level Security (RLS) Policies:**\n"
            for p in table['policies']:
                md += f"- `{p}`\n"
                
        if table['triggers']:
            md += "\n**Triggers:**\n"
            for tr in table['triggers']:
                md += f"- `{tr}`\n"
                
        md += "\n---\n\n"

    md += "## 👁️ Views\n"
    if views:
        for v in views:
            md += f"### `{v['name']}`\n"
            md += f"```sql\n{v['def']}\n```\n\n"
    else:
        md += "No public views defined.\n\n"

    md += "## ⚡ Functions\n"
    if functions:
        md += f"Found {len(functions)} functions. Key functions include:\n"
        for f in functions:
            md += f"- `{f['name']}`\n"
    else:
        md += "No public functions defined.\n\n"

    with open(output_file, 'w') as out:
        out.write(md)
        
    print(f"Generated comprehensive analysis for {len(tables)} tables, {len(views)} views, and {len(functions)} functions.")

if __name__ == '__main__':
    parse_schema_full('/home/maykano/Downloads/New C2g Logistics/schema.sql', '/home/maykano/.gemini/antigravity/brain/3953a1f8-586e-4f41-9b6d-a5c2a52e1bd6/database_analysis_report.md')
