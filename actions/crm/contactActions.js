// @/actions/contactActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Contact from '@/lib/database/models/crm/Contact.model';


// Get all contacts
export const getContacts = async () => {
  await connectToDatabase();
  const contacts = await Contact.find({}).lean();
  return contacts.map(contact => ({
    ...contact,
    _id: contact._id.toString(),
  }));
};

// Get a single contact by ID
export const getContactById = async (id) => {
  await connectToDatabase();
  const contact = await Contact.findById(id);
  if (!contact) {
    return null;
  }
  return {
    ...contact.toObject(),
    _id: contact._id.toString(),
  };
};

// Create a new contact
export const createContact = async (contactData) => {
  await connectToDatabase();

  // Check if the customer_id already exists
  const existingContact = await Contact.findOne({ customer_id: contactData.customer_id });
  if (existingContact) {
    return { success: false, error: true, message: 'Customer ID already exists' };
  }

  const newContact = new Contact(contactData);
  const savedContact = await newContact.save();
  return { success: true, error: false, contact: savedContact.toObject() };
};

// Update an existing contact
export const updateContact = async (updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedContact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedContact) {
    return { success: false, message: 'Contact not found' };
  }
  return { success: true, contact: updatedContact.toObject() };
};

// Delete a contact
export const deleteContact = async (id) => {
  await connectToDatabase();
  const deletedContact = await Contact.findByIdAndDelete(id);
  if (!deletedContact) {
    return { success: false, message: 'Contact not found' };
  }
  return { success: true, message: 'Contact deleted successfully' };
};
