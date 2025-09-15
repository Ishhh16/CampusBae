import { supabase } from '../lib/supabaseClient';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
  branch: string;
  semester?: number | string;
  condition: string;
  seller: string;
  sellerYear?: string;
  sellerPhone: string;
  image: string;
  description: string;
  liked: boolean;
  likes: number;
  createdAt: string;
  userId?: string;
}

export interface NewMarketplaceItem {
  title: string;
  sellerName: string;
  phoneNumber: string;
  description: string;
  category: string;
  condition: string;
  price: string;
  branch: string;
  image?: File;
}

class MarketplaceService {
  private isOffline = false;
  private storageKey = 'campusbae_marketplace_items';

  // Initialize with sample data if localStorage is empty
  private initializeLocalStorage() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      const sampleItems: MarketplaceItem[] = [
        {
          id: '1',
          title: 'Data Structures Textbook - Cormen',
          price: '₹800',
          originalPrice: '₹1200',
          category: 'Books',
          branch: 'CSE',
          semester: 3,
          condition: 'Good',
          seller: 'Priya Sharma',
          sellerYear: '3rd Year',
          sellerPhone: '+91 98765 43210',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
          description: 'Well-maintained textbook with minimal highlighting',
          liked: false,
          likes: 12,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Scientific Calculator (Casio FX-991ES)',
          price: '₹500',
          originalPrice: '₹800',
          category: 'Electronics',
          branch: 'All',
          semester: 'All',
          condition: 'Excellent',
          seller: 'Ananya Khurana',
          sellerYear: '2nd Year',
          sellerPhone: '+91 87654 32109',
          image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
          description: 'Rarely used calculator in excellent condition',
          liked: true,
          likes: 8,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Lab Coat - Size M',
          price: '₹300',
          originalPrice: '₹500',
          category: 'Clothing',
          branch: 'All',
          semester: 'All',
          condition: 'Good',
          seller: 'Shruti Malik',
          sellerYear: '4th Year',
          sellerPhone: '+91 76543 21098',
          image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
          description: 'Clean lab coat, used for one semester',
          liked: false,
          likes: 3,
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Engineering Drawing Instruments Set',
          price: '₹350',
          originalPrice: '₹600',
          category: 'Stationery',
          branch: 'All',
          semester: 1,
          condition: 'Good',
          seller: 'Riya Patel',
          sellerYear: '3rd Year',
          sellerPhone: '+91 65432 10987',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
          description: 'Complete set with compass, dividers, and rulers',
          liked: false,
          likes: 15,
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          title: 'Computer Networks Book - Tanenbaum',
          price: '₹600',
          originalPrice: '₹900',
          category: 'Books',
          branch: 'CSE',
          semester: 5,
          condition: 'Fair',
          seller: 'Neha Singh',
          sellerYear: '4th Year',
          sellerPhone: '+91 54321 09876',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
          description: 'Some highlighting and notes in margins',
          liked: true,
          likes: 20,
          createdAt: new Date().toISOString()
        },
        {
          id: '6',
          title: 'Laptop Stand - Adjustable',
          price: '₹450',
          originalPrice: '₹750',
          category: 'Electronics',
          branch: 'All',
          semester: 'All',
          condition: 'Excellent',
          seller: 'Kavya Agarwal',
          sellerYear: '2nd Year',
          sellerPhone: '+91 43210 98765',
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
          description: 'Portable and lightweight laptop stand',
          liked: false,
          likes: 6,
          createdAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(sampleItems));
    }
  }

  // Get all marketplace items
  async getItems(): Promise<MarketplaceItem[]> {
    try {
      console.log('🔄 Attempting to fetch items from database...');
      
      // Try database first
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('✅ Successfully fetched from database:', data?.length, 'items');
      
      // Transform database items to match our interface
      const transformedItems: MarketplaceItem[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        originalPrice: item.original_price || undefined,
        category: item.category,
        branch: item.branch,
        semester: item.semester || undefined,
        condition: item.condition,
        seller: item.seller,
        sellerYear: item.seller_year || undefined,
        sellerPhone: item.seller_phone,
        image: item.image || '',
        description: item.description,
        liked: false, // We don't track individual likes anymore
        likes: 0, // We don't use likes system
        createdAt: item.created_at,
        userId: item.user_id
      }));
      
      // Reset offline flag on successful connection
      this.isOffline = false;
      return transformedItems;
      
    } catch (error) {
      console.log('⚠️ Database unavailable, using localStorage:', error);
      this.isOffline = true;
      
      // Fallback to localStorage
      this.initializeLocalStorage();
      const items = localStorage.getItem(this.storageKey);
      return items ? JSON.parse(items) : [];
    }
  }

  // Add new marketplace item
  async addItem(newItem: NewMarketplaceItem, userId?: string): Promise<MarketplaceItem> {
    // Generate unique ID using crypto.randomUUID() for better database compatibility
    const id = crypto.randomUUID();
    let imageUrl = '';

    // Handle image upload
    if (newItem.image) {
      imageUrl = await this.uploadImage(newItem.image, id);
    }

    // Format price with ₹ if not already present
    const formattedPrice = newItem.price.startsWith('₹') ? newItem.price : `₹${newItem.price}`;

    const marketplaceItem: MarketplaceItem = {
      id,
      title: newItem.title,
      price: formattedPrice,
      category: newItem.category,
      branch: newItem.branch,
      condition: newItem.condition,
      seller: newItem.sellerName,
      sellerPhone: newItem.phoneNumber,
      image: imageUrl,
      description: newItem.description,
      liked: false,
      likes: 0,
      createdAt: new Date().toISOString(),
      userId
    };

    try {
      // Try database first
      if (!this.isOffline) {
        console.log('💾 Attempting to save item to database...');
        
        const { data, error } = await supabase
          .from('marketplace_items')
          .insert([{
            id: marketplaceItem.id,
            title: marketplaceItem.title,
            price: marketplaceItem.price,
            original_price: null, // We don't capture original price in the form
            category: marketplaceItem.category,
            branch: marketplaceItem.branch,
            semester: null, // We don't capture semester in the form
            condition: marketplaceItem.condition,
            seller: marketplaceItem.seller,
            seller_year: null, // We don't capture seller year in the form
            seller_phone: marketplaceItem.sellerPhone,
            image: marketplaceItem.image,
            description: marketplaceItem.description,
            user_id: userId
          }])
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          throw error;
        }
        
        console.log('✅ Successfully saved item to database:', data);
        return marketplaceItem;
      }
    } catch (error) {
      console.log('⚠️ Database unavailable, using localStorage:', error);
      this.isOffline = true;
    }

    // Fallback to localStorage
    const items = await this.getItems();
    const updatedItems = [marketplaceItem, ...items];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedItems));
    
    return marketplaceItem;
  }

  // Upload image (convert to base64 for localStorage fallback)
  private async uploadImage(file: File, itemId: string): Promise<string> {
    try {
      // Try Supabase storage first
      if (!this.isOffline) {
        const fileName = `${itemId}-${Date.now()}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
          .from('marketplace-images')
          .upload(fileName, file);

        if (!error) {
          const { data: urlData } = supabase.storage
            .from('marketplace-images')
            .getPublicUrl(fileName);
          
          return urlData.publicUrl;
        }
      }
    } catch (error) {
      console.log('Image upload to storage failed, using base64:', error);
    }

    // Fallback to base64 encoding for localStorage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // Toggle like status (simplified - only localStorage for now)
  async toggleLike(itemId: string): Promise<void> {
    // Since we removed the likes system from database, just update localStorage
    const items = await this.getItems();
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          liked: !item.liked,
          likes: item.liked ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    });
    
    localStorage.setItem(this.storageKey, JSON.stringify(updatedItems));
  }

  // Remove item from marketplace
  async removeItem(itemId: string): Promise<void> {
    try {
      if (!this.isOffline) {
        console.log('🗑️ Attempting to delete item from database...');
        
        const { error } = await supabase
          .from('marketplace_items')
          .delete()
          .eq('id', itemId);

        if (error) {
          console.error('Database delete error:', error);
          throw error;
        }
        
        console.log('✅ Successfully deleted item from database');
        return;
      }
    } catch (error) {
      console.log('⚠️ Database unavailable for delete, using localStorage:', error);
      this.isOffline = true;
    }

    // Fallback to localStorage
    const existingItems = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const filteredItems = existingItems.filter((item: MarketplaceItem) => item.id !== itemId);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
  }

  // Check if using offline mode
  isUsingOfflineMode(): boolean {
    return this.isOffline;
  }

  // Reset offline mode and try to reconnect
  async retryConnection(): Promise<boolean> {
    try {
      console.log('🔄 Attempting to reconnect to database...');
      this.isOffline = false;
      
      // Test connection by trying to fetch items
      await this.getItems();
      return !this.isOffline;
    } catch (error) {
      console.log('⚠️ Reconnection failed:', error);
      return false;
    }
  }
}

export const marketplaceService = new MarketplaceService();