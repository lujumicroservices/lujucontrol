import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project URL and anon key
const supabase = createClient(
  'https://<your-project-id>.supabase.co', // Replace with your Supabase URL
  '<your-anon-api-key>'                    // Replace with your Supabase Anon key
);

const supabaseApi = (tableName: string) => ({
  async create<T extends { id?: string }>(data: T) {
    const { data: newItem, error } = await supabase
      .from(tableName)
      .insert([data])
      .single();

    if (error) {
      throw new Error(`Error creating item: ${error.message}`);
    }

    return newItem;
  },

  async delete(ids: string[]) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .in('id', ids);

    if (error) {
      throw new Error(`Error deleting items: ${error.message}`);
    }

    return { success: true };
  },

  async update<T>(id: string, updatedData: Record<string, unknown>) {
    const { data: updatedItem, error } = await supabase
      .from(tableName)
      .update(updatedData)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error updating item: ${error.message}`);
    }

    return updatedItem;
  },

  async updateMany<T extends { id: string }>(items: T[]) {
    const updates = items.map((item) => {
      return supabase.from(tableName).upsert(item);
    });

    const results = await Promise.all(updates);

    results.forEach((result) => {
      if (result.error) {
        throw new Error(`Error updating many items: ${result.error.message}`);
      }
    });

    return items;
  },

  async find<T extends { id?: string }>(param: string | Record<string, unknown>) {
    let query = supabase.from(tableName).select('*');

    if (typeof param === 'string') {
      // Find by ID
      query = query.eq('id', param).single();
    } else {
      // Find by query parameters
      Object.entries(param).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error finding item: ${error.message}`);
    }

    return data || null;
  },

  async findAll<T>(queryParams: Record<string, unknown> = {}) {
    let query = supabase.from(tableName).select('*');

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value === 'not_null') {
        query = query.is(key, null);
      } else {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error finding all items: ${error.message}`);
    }

    return data || [];
  }
});

export default supabaseApi;
