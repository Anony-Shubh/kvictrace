/**
 * Centralized API Service
 * Replace endpoints and mock data with real API calls when ready
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.khaditrace.com";

// Mock data - replace with real API calls
const mockProductData = {
  "BGS-SR-0145": {
    id: "BGS-SR-0145",
    name: "Khadi Silk Plain Saree",
    description:
      "Handspun and Handwoven Khadi Saree Made From 100% Mulberry Silk",
    imageUrl: "https://via.placeholder.com/640x800?text=Khadi+Saree", // Replace with actual image URL from API
    videoUrl: "https://via.placeholder.com/640x480?text=Product+Video", // Replace with actual video URL
    lastUpdatedDate: "12 Aug 2026",
    productionDate: "28 08 2026",
    origin: "Karnataka, India",
    category: "Textile/Saree",
    material: "100% Mulberry Silk",
    specifications: "6.25m X 1.14m",
    weight: "500-550g",
    spinningDetails: "Handspun",
    weaveDetails: "Handwoven",
    style: "Plain Weave",
    productionLocation: "BGS Facility, Murugmalla",
    institution: {
      name: "Bharati Gramodyog Sangha",
      description:
        "Bharati Khadi Gramodyog Sangh is a certified Khadi Institute in Chintamani, Karnataka, specializing in authentic, decentralized handloom Khadi production.",
      certificates: [
        {
          type: "KHADI CERTIFICATE",
          value: "1693 / 1992 / Active",
          link: "#",
        },
        {
          type: "KHADI MARK",
          value: "KVIC/KNT/XXX",
          status: "Verified",
        },
      ],
      badges: ["Khadi Certificate: Under Process", "Khadi Mark: Active"],
      geoLocation: {
        latitude: 13.2298,
        longitude: 78.4575,
        address: "Chalamakote, Chintamani, Karnataka, India",
        city: "Chintamani",
        state: "Karnataka",
        country: "India",
        pincode: "561201",
      },
    },
    productionSteps: [
      {
        id: 1,
        label: "Raw material source",
        value: "Chikkaballapura, KA",
        geoLocation: {
          latitude: 13.2163,
          longitude: 78.1515,
          address: "Chikkaballapura District, Karnataka, India",
          city: "Chikkaballapura",
          state: "Karnataka",
          country: "India",
        },
      },
      {
        id: 2,
        label: "Spinning",
        value: "Murugamalla, KA",
        geoLocation: {
          latitude: 13.1989,
          longitude: 78.4234,
          address: "Murugamalla, Chintamani, Karnataka, India",
          city: "Chintamani",
          state: "Karnataka",
          country: "India",
        },
      },
      {
        id: 3,
        label: "Dyeing",
        value: "Chintamani, KA",
        geoLocation: {
          latitude: 13.2245,
          longitude: 78.4568,
          address: "Chintamani, Karnataka, India",
          city: "Chintamani",
          state: "Karnataka",
          country: "India",
        },
      },
      {
        id: 4,
        label: "Weaving",
        value: "Chintamani, KA",
        geoLocation: {
          latitude: 13.2298,
          longitude: 78.4575,
          address: "Chintamani, Karnataka, India",
          city: "Chintamani",
          state: "Karnataka",
          country: "India",
        },
      },
    ],
    productionStory:
      "This product uses 100% natural Mulberry silk, procured locally from farmers in Chikkaballapur. The entire production process takes place in a 30 km radius, helping reduce transportation distances across the value chain. Key processes, including reeling, spinning and weaving, are carried out manually at different units within the local cluster, supporting traditional skills and creating employment opportunities for people in the region.",
    isVerified: true,
  },
};

/**
 * Fetch product details by ID
 * @param {string} productId - The product ID to fetch
 * @returns {Promise<Object>} Product data
 */
export const fetchProductData = async (productId) => {
  const apiUrl = import.meta.env.VITE_API_URL || API_BASE_URL;

  if (apiUrl) {
    try {
      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/products/${productId}`,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      console.warn("Falling back to mock product data:", error);
    }
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockProductData[productId]) {
        resolve(mockProductData[productId]);
      } else {
        reject(new Error(`Product ${productId} not found`));
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Fetch production journey data
 * @param {string} productId - The product ID
 * @returns {Promise<Object>} Production journey data
 */
export const fetchProductionJourney = async (productId) => {
  // TODO: Replace with real API call
  // return fetch(`${API_BASE_URL}/api/products/${productId}/journey`).then(res => res.json());

  const productData = mockProductData[productId];
  if (!productData) {
    return Promise.reject(new Error(`Product ${productId} not found`));
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        productId,
        steps: productData.productionSteps,
        story: productData.productionStory,
        locations: productData.productionSteps.map((step) => ({
          name: step.value,
          process: step.label,
        })),
      });
    }, 600);
  });
};

/**
 * Share product passport
 * @param {string} productId - The product ID
 * @param {Object} options - Share options (recipient email, etc.)
 * @returns {Promise<Object>} Response from share API
 */
export const shareProductPassport = async (productId, options = {}) => {
  // TODO: Replace with real API call
  // return fetch(`${API_BASE_URL}/api/products/${productId}/share`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(options)
  // }).then(res => res.json());

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Passport shared successfully",
        productId,
        shareToken: `share_${productId}_${Date.now()}`,
      });
    }, 400);
  });
};

/**
 * Verify product authenticity
 * @param {string} productId - The product ID
 * @returns {Promise<Object>} Verification status
 */
export const verifyProductAuthenticity = async (productId) => {
  // TODO: Replace with real API call
  // return fetch(`${API_BASE_URL}/api/products/${productId}/verify`).then(res => res.json());

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        productId,
        isVerified: mockProductData[productId]?.isVerified ?? false,
        verificationDate: new Date().toISOString(),
        certificate: "KVIC Certified",
      });
    }, 300);
  });
};

export default {
  fetchProductData,
  fetchProductionJourney,
  shareProductPassport,
  verifyProductAuthenticity,
};
