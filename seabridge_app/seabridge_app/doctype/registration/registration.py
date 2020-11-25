# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Registration(Document):
	pass

def on_registration_submit(doc,method):
        co_doc=frappe.get_doc(dict(doctype = 'Company',
                    company_name=doc.company,
                    abbr=doc.abbr,
                    company_type=doc.company_type,		
                    default_currency=doc.default_currency,
                    country=doc.country,
                    parent_company=doc.parent_company,
                    associate_agent_company=doc.agent_company,
                    associate_agent=doc.agent_user,
                    start_date=doc.start_date,
                    end_date=doc.end_date,
                    has_sbtfx_contract=doc.has_sbtfx_contract,
                    bank_name=doc.bank_name,
                    bank_account=doc.bank_account
        )).insert(ignore_mandatory=True)
        co_doc.save()

        us_doc=frappe.get_doc(dict(doctype = 'User',
                    email=doc.email,
                    first_name=doc.first_name,
                    last_name=doc.last_name,
                    represents_company=doc.company,
                    send_welcome_email=doc.send_welcome_email
        )).insert(ignore_mandatory=True)
        if doc.company_type=="Agent":
            us_doc.append('roles', {
                    'role':"Agent"
	    })
        if doc.company_type=="Customer":
            us_doc.append('roles', {
                    'role':"customer"
	    })

        us_doc.save()

        if doc.company_type!="Customer":
                    if doc.supplier_name:
                        su_doc=frappe.get_doc(dict(doctype = 'Supplier',
                        supplier_name=doc.supplier_name,
                        supplier_group=doc.supplier_group,
                        supplier_type=doc.supplier_type,
                        country=doc.country,
                        is_internal_supplier=1,
                        represents_company=doc.company,
                        has_sbtfx_contract=doc.has_sbtfx_contract,
                        bank_name=doc.bank_name,
                        bank_account=doc.bank_account
                        )).insert(ignore_mandatory=True)
                        su_doc.save()
        if doc.company_type=="Customer":
                    cu_doc=frappe.get_doc(dict(doctype = 'Customer',
                    customer_name=doc.customer_name,
                    customer_group=doc.customer_group,
                    customer_type=doc.customer_type,
                    is_internal_customer=1,
                    represents_company=doc.company
                    )).insert(ignore_mandatory=True)
                    cu_doc.save()

        if doc.company_type=="Agent":
                    ag_doc=frappe.get_doc(dict(doctype = 'Agent',
                    agent_company=doc.company,
                    company_type="Agent")).insert()
                    ag_doc.save()


        if doc.company_type!="Customer":
                    if doc.supplier_name:
                        frappe.msgprint('Supplier ' +doc.supplier_name+', Company '+doc.company+' and User '+doc.first_name+' is created successfully. Please check Is Internal Supplier and update Represents Company as '+doc.company,'Alert')

        if doc.company_type=="Customer":
                    frappe.msgprint('Customer '+doc.customer_name+', Company '+doc.company+' and User '+doc.first_name+' is created successfully. Please check Is Internal Customer and update Represents Company as '+doc.company,'Alert')
