#!/usr/bin/env python3
import json, re, zipfile
from datetime import datetime, UTC
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

def norm(s): return re.sub(r'\s+',' ',str(s or '').strip())
def cell_col(ref): return re.sub(r'\d+','',ref or '')
def col_num(col):
    n=0
    for c in col: n=n*26+ord(c.upper())-64
    return n-1

def read_xlsx(path):
    with zipfile.ZipFile(path) as z:
        ss=[]
        if 'xl/sharedStrings.xml' in z.namelist():
            root=ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in root.findall('m:si',NS):
                ss.append(''.join(t.text or '' for t in si.findall('.//m:t',NS)))
        wb=ET.fromstring(z.read('xl/workbook.xml'))
        rels=ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        relmap={r.attrib['Id']:r.attrib['Target'] for r in rels}
        out={}
        for sh in wb.findall('m:sheets/m:sheet',NS):
            name=sh.attrib['name']; rid=sh.attrib.get('{%s}id'%NS['r'])
            target=relmap[rid].lstrip('/')
            if not target.startswith('xl/'): target='xl/'+target
            root=ET.fromstring(z.read(target))
            rows=[]
            for row in root.findall('.//m:sheetData/m:row',NS):
                vals=[]
                for c in row.findall('m:c',NS):
                    i=col_num(cell_col(c.attrib.get('r','A')))
                    while len(vals)<=i: vals.append('')
                    v=c.find('m:v',NS); val=v.text if v is not None else ''
                    if c.attrib.get('t')=='s' and val!='': val=ss[int(val)]
                    elif c.attrib.get('t')=='inlineStr': val=''.join(t.text or '' for t in c.findall('.//m:t',NS))
                    vals[i]=norm(val)
                rows.append(vals)
            out[name]=rows
        return out

def rows_to_dicts(rows):
    best=max(range(min(10,len(rows))), key=lambda i: sum(1 for x in rows[i] if norm(x)), default=0)
    headers=[norm(h) or f'Column {i+1}' for i,h in enumerate(rows[best])]
    data=[]
    for r in rows[best+1:]:
        if not any(norm(x) for x in r): continue
        d={headers[i] if i<len(headers) else f'Column {i+1}': norm(v) for i,v in enumerate(r)}
        data.append(d)
    return data

def pick(d,*keys):
    lk={re.sub(r'[^a-z0-9]','',k.lower()):v for k,v in d.items()}
    for key in keys:
        kk=re.sub(r'[^a-z0-9]','',key.lower())
        for k,v in lk.items():
            if kk in k and v: return v
    return ''

def money(v):
    try: return float(re.sub(r'[^0-9.-]','',str(v)) or 0)
    except: return 0

schools_raw=read_xlsx(ROOT/'KaghazNagar-Schools-list.xlsx')
schools=[]; seen=set()
for sheet, rows in schools_raw.items():
    for d in rows_to_dicts(rows):
        ud=pick(d,'udise','school code')
        if not ud or ud in seen: continue
        seen.add(ud)
        district=pick(d,'district')
        if district.upper()=='KOMARAM BHEEM': district='KUMURAM BHEEM ASIFABAD'
        status=pick(d,'status') or 'Operational'
        if status.lower() in ('yes','active','onboarded'): status='Operational'
        name=pick(d,'school name','school')
        block=pick(d,'block','mandal')
        village=pick(d,'village') or (name.replace('Mpps ','') if name.lower().startswith('mpps ') else '')
        address=pick(d,'address') or ', '.join(x for x in [village, block, district] if x)
        schools.append({'id':len(schools)+1,'udiseCode':ud,'academicYear':pick(d,'academic year') or '2026-27','state':(pick(d,'state') or 'TELANGANA').upper(),'district':district,'block':block,'schoolName':name.upper(),'address':address,'status':status,'sourceSheet':sheet,'original':d})

budget_raw=read_xlsx(ROOT/'Vidyanjali_School_Adoption_Budget_Tool_v1.xlsx')
work_areas=[]; wa_ids={}; comps=[]; seen_comp=set()
for sheet, rows in budget_raw.items():
    if sheet.lower() in ('school_profile','lists') or len(rows)<2: continue
    for idx,d in enumerate(rows_to_dicts(rows),1):
        item=pick(d,'item','particular','activity','description')
        if not item: continue
        wa=pick(d,'work area','category') or sheet
        if wa not in wa_ids:
            wa_ids[wa]=len(work_areas)+1; work_areas.append({'id':wa_ids[wa],'workAreaName':wa,'description':f'Imported from {sheet}','sortOrder':len(work_areas)+1,'isActive':True,'sourceSheet':sheet})
        comp=pick(d,'component') or wa; sub=pick(d,'sub component','sub-component')
        unit=pick(d,'unit type','unit','uom'); cost=money(pick(d,'cost','rate','amount','estimated'))
        key=(wa,comp,sub,item,unit)
        if key in seen_comp: continue
        seen_comp.add(key)
        comps.append({'id':len(comps)+1,'workAreaId':wa_ids[wa],'componentName':comp,'subComponentName':sub,'itemName':item,'unitType':unit,'unitCost':cost,'defaultQuantity':1,'remarks':pick(d,'remarks','note'),'sortOrder':len(comps)+1,'isActive':True,'sourceSheet':sheet,'original':d})
meta={'generatedAt':datetime.now(UTC).isoformat().replace('+00:00','Z'),'sourceWorkbooks':['KaghazNagar-Schools-list.xlsx','Vidyanjali_School_Adoption_Budget_Tool_v1.xlsx'],'schoolSheets':list(schools_raw),'budgetSheets':list(budget_raw)}
out=ROOT/'src/data/vidyanjali'; out.mkdir(parents=True,exist_ok=True)
(out/'schools.json').write_text(json.dumps(schools,indent=2,ensure_ascii=False))
(out/'workAreas.json').write_text(json.dumps(work_areas,indent=2,ensure_ascii=False))
(out/'components.json').write_text(json.dumps(comps,indent=2,ensure_ascii=False))
(out/'metadata.json').write_text(json.dumps(meta,indent=2))
print(f'imported {len(schools)} schools, {len(work_areas)} work areas, {len(comps)} components')
