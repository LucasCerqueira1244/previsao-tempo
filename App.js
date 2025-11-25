import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OPENWEATHER_API_KEY } from "@env";

export default function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  async function searchCities(text) {
    setCity(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${OPENWEATHER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.log("Erro ao buscar cidades:", err);
    }
  }

  async function getWeather(lat, lon) {
    try {
      Keyboard.dismiss();
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&lang=pt_br&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
      setSuggestions([]);
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="weather-cloudy" size={60} color="#0d47a1" />

      <Text style={styles.title}>Previsão do Tempo</Text>

      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={22} color="#555" />
        <TextInput
          value={city}
          onChangeText={searchCities}
          placeholder="Digite uma cidade"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>
      {suggestions.length > 0 && (
        <FlatList
          style={styles.list}
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                Keyboard.dismiss();
                setSelectedCity(item);
                getWeather(item.lat, item.lon);
              }}
            >
              <MaterialCommunityIcons name="map-marker" size={20} color="#0d47a1" />
              <Text style={styles.listItemText}>
                {item.name} - {item.state} - {item.country}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {weather && (
        <View style={styles.result}>
          
          {/* Ícone da API */}
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            }}
          />

          <Text style={styles.resultTitle}>{weather.name}</Text>

          {selectedCity && (
            <>
              <Text style={styles.resultText}>Estado: {selectedCity.state}</Text>
              <Text style={styles.resultText}>País: {selectedCity.country}</Text>
            </>
          )}

          <View style={styles.resultRow}>
            <MaterialCommunityIcons name="thermometer" size={22} color="#d32f2f" />
            <Text style={styles.resultText}>
              {weather.main.temp}°C
            </Text>
          </View>

          <View style={styles.resultRow}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={22} color="#0288d1" />
            <Text style={styles.resultText}>
              {weather.weather[0].description}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 20
  },

  /** 🔎 Caixa de busca */
  searchBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },

  /** 📍 Lista de sugestões */
  list: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden"
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  listItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0d47a1"
  },

  /** 🌤 Card de resultado */
  result: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4
  },
  weatherIcon: {
    width: 90,
    height: 90,
    marginBottom: 10
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 10
  },
  resultText: {
    fontSize: 18,
    color: "#0d47a1",
    marginBottom: 8
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  }
});
