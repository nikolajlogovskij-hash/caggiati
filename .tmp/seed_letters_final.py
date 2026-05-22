"""Final: fix duplicates, categorize properly, generate SQL for Supabase."""
import json

with open('.tmp/letters_data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Fix prefix categories - add missing ones
prefix_categories = {
    '00950': {'height': '5cm', 'language': 'Cyrillic', 'case': 'uppercase', 'category': 'letter'},
    '00930': {'height': '3cm', 'language': 'Cyrillic', 'case': 'lowercase', 'category': 'letter'},
    '46303': {'height': '3cm', 'language': None, 'case': 'number', 'category': 'number'},
    '46051': {'height': '3cm', 'language': None, 'case': 'number', 'category': 'number'},
    '46055': {'height': '3cm', 'language': None, 'case': 'number', 'category': 'number'},
    '46057': {'height': '3cm', 'language': None, 'case': 'number', 'category': 'number'},
    '46061': {'height': '3cm', 'language': None, 'case': 'symbol', 'category': 'symbol'},
    '46063': {'height': '3cm', 'language': None, 'case': 'symbol', 'category': 'symbol'},
}

# Fix duplicates: 00950/00 appears twice (Й uppercase and й lowercase)
# We need to make articul unique. Let's check.
seen_articuls = {}
unique_products = []

for p in products:
    articul = p['articul']
    prefix = articul.split('/')[0]
    cat = prefix_categories.get(prefix, {'height': 'unknown', 'category': 'other'})
    
    p['height'] = cat['height']
    p['category'] = cat['category']
    
    if articul in seen_articuls:
        # Duplicate! Print info
        existing = seen_articuls[articul]
        print(f"DUPLICATE: {articul} = '{p['char']}' (row {p['row']}) vs existing '{existing['char']}' (row {existing['row']})")
        # Keep the one with most stock, or first occurrence
        if p['total'] > existing['total']:
            unique_products = [p if x['articul'] == articul else x for x in unique_products]
            seen_articuls[articul] = p
            print(f"  -> Keeping row {p['row']} (total: {p['total']})")
        else:
            print(f"  -> Keeping existing row {existing['row']} (total: {existing['total']})")
    else:
        seen_articuls[articul] = p
        unique_products.append(p)

# Fix 00950/00: there's Й (uppercase) and й (lowercase). 
# The lowercase й should actually be 00930/00, not 00950/00.
# But the Excel has it as 00950/00. Let's check the data.
# Actually looking at the output, one 00950/00 is 'Й'(uppercase) with total=10 
# and another is 'й'(lowercase) with total=805.
# The lowercase one should probably be 00930/00 but Excel has it as 00950/00.
# We'll keep lowercase 'й' since it has more stock, and note uppercase 'Й' is separate.

# For now, let's handle the Й/й issue:
# If 00950/00 is uppercase 'Й' -> keep as 00950/00 (special uppercase)
# The lowercase 'й' should be 00930/00 but Excel has it wrong
# Let's manually fix the lowercase one
for p in unique_products:
    if p['articul'] == '00950/00' and p['char'] == 'й':
        # This is actually lowercase, should be 00930/00
        # But we don't want to change articul since it's the real articul
        # Just mark it correctly
        p['notes'] = 'lowercase й - likely mislabeled in source, should be 00930/00'
        print(f"NOTES: {p['articul']} = '{p['char']}' - {p['notes']}")

# Also check 46303/8 with empty char
for p in unique_products:
    if p['char'] == '':
        print(f"EMPTY CHAR: {p['articul']} (row {p['row']}, col {p['col']})")

print(f"\nFinal unique products: {len(unique_products)}")

# Print summary
for p in unique_products:
    print(f"  {p['articul']:12s} '{p['char']:3s}'  5cm:{p['stock_5cm']:4d}  3cm:{p['stock_3cm']:4d}  total:{p['total']:4d}  [{p['height']} {p['category']}]")

# Generate SQL for Supabase
print("\n\n=== SQL INSERT (for Supabase) ===")
print("INSERT INTO letters (articul, letter, height, category, stock_5cm, stock_3cm, total_stock) VALUES")
values = []
for p in unique_products:
    char = p['char'].replace("'", "''")  # escape single quotes
    values.append(
        f"  ('{p['articul']}', '{char}', '{p['height']}', '{p['category']}', "
        f"{p['stock_5cm']}, {p['stock_3cm']}, {p['total']})"
    )
print(",\n".join(values) + "\nON CONFLICT (articul) DO UPDATE SET\n"
      "  letter = EXCLUDED.letter,\n"
      "  height = EXCLUDED.height,\n"
      "  category = EXCLUDED.category,\n"
      "  stock_5cm = EXCLUDED.stock_5cm,\n"
      "  stock_3cm = EXCLUDED.stock_3cm,\n"
      "  total_stock = EXCLUDED.total_stock;")

print(f"\n\nTotal: {len(unique_products)} unique products ready to seed")