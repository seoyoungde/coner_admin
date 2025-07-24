// AppContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [customer, setCustomer] = useState([]);
  const [engineer, setEngineer] = useState([]);
  const [partner, setPartner] = useState([]);
  const [payment, setPayment] = useState([]);
  const [request, setRequest] = useState([]);

  const refreshAll = async () => {
    try {
      const [
        snapCustomer,
        snapEngineer,
        snapPartner,
        snapPayment,
        snapRequest,
      ] = await Promise.all([
        getDocs(collection(db, "Customer")),
        getDocs(collection(db, "Engineer")),
        getDocs(collection(db, "Partner")),
        getDocs(collection(db, "Payment")),
        getDocs(collection(db, "Request")),
      ]);

      setCustomer(
        snapCustomer.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setEngineer(
        snapEngineer.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setPartner(
        snapPartner.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setPayment(
        snapPayment.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setRequest(
        snapRequest.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("🔥 Firebase 데이터 새로고침 실패:", error);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <AppContext.Provider
      value={{
        customer,
        engineer,
        partner,
        payment,
        request,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
