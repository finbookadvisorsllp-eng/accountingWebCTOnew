import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientForm from "./CreateClient";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSaved = () => {
    navigate("/admin/clients");
  };

  return <ClientForm clientId={id} onSaved={handleSaved} />;
}
