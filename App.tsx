import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/products`, {});
      console.log(response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(
        `https://dummyjson.com/products/add`,
        {name: productName},
        {headers: {'Content-Type': 'application/json'}},
      );
      setProductName('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    console.log(productId);
    try {
      await axios.delete(`https://dummyjson.com/products/${productId}`, {});
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product List</Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleProductPress(item)}>
            <Text style={styles.productCard}>{item.title}</Text>
            <Button
              title="Delete Product"
              onPress={() => handleDeleteProduct(item.id)}
              color="#FF0000"
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No products available</Text>}
        style={styles.productList}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
      />

      <Button title="Add Product" onPress={handleAddProduct} color="#4CAF50" />

      {selectedProduct && (
        <View style={styles.productDetailsContainer}>
          <Text style={styles.productDetailsTitle}>Product Details</Text>
          <Text>ID: {selectedProduct.id}</Text>
          <Text>Name: {selectedProduct.title}</Text>
          <Button
            title="Delete Product"
            onPress={() => handleDeleteProduct(selectedProduct.id)}
            color="#FF0000"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#FFF',
  },
  productList: {
    marginBottom: 20,
  },
  productCard: {
    padding: 10,
    backgroundColor: '#D3D3D3',
    marginBottom: 10,
  },
  productDetailsContainer: {
    marginTop: 20,
  },
  productDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default App;
