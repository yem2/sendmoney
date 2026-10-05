import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COUNTRIES, getExchangeRate, createTransfer } from "../../api/mockApi";

const STEP_LABELS = ["Pays d'envoi", "Pays de réception", "Bénéficiaire", "Récapitulatif"];

export default function SendMoney() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState(COUNTRIES[0]);
  const [to, setTo] = useState(null);
  const [beneficiary, setBeneficiary] = useState({ name: "", phone: "", mode: "Mobile Money", amount: 100000 });
  const [rate, setRate] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (from && to) getExchangeRate(from.currency, to.currency).then(setRate);
  }, [from, to]);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await createTransfer({
        from: from.code,
        to: to.code,
        sentAmount: beneficiary.amount,
        sentCurrency: from.currency,
        receivedAmount: Math.round(beneficiary.amount * rate * 100) / 100,
        receivedCurrency: to.currency,
      });
      navigate("/app/transactions");
    } finally {
      setSubmitting(false);
    }
  }

  const fee = Math.round(beneficiary.amount * 0.015);
  const received = Math.round((beneficiary.amount - fee) * rate);

  return (
    <div className="page wizard">
      <div className="steps">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const cls = n < step ? "done" : n === step ? "current" : "";
          return <div key={label} className={`step ${cls}`}><span className="dot">{n}</span>{label}</div>;
        })}
      </div>

      <div className="card">
        {step === 1 && (
          <>
            <h2>Pays d'envoi</h2>
            <div className="country-grid">
              {COUNTRIES.map((c) => (
                <div key={c.code} className={`country ${from?.code === c.code ? "selected" : ""}`} onClick={() => setFrom(c)}>
                  <span className="flag">{c.flag}</span>{c.name}
                </div>
              ))}
            </div>
            <div className="wizard-actions"><span /><button className="btn btn-primary" onClick={() => setStep(2)}>Suivant →</button></div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Pays de réception</h2>
            <div className="country-grid">
              {COUNTRIES.filter((c) => c.code !== from?.code).map((c) => (
                <div key={c.code} className={`country ${to?.code === c.code ? "selected" : ""}`} onClick={() => setTo(c)}>
                  <span className="flag">{c.flag}</span>{c.name}
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Retour</button>
              <button className="btn btn-primary" disabled={!to} onClick={() => setStep(3)}>Suivant →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Informations du bénéficiaire</h2>
            <div className="form-grid">
              <label>Nom complet<input value={beneficiary.name} onChange={(e) => setBeneficiary({ ...beneficiary, name: e.target.value })} /></label>
              <label>Téléphone<input value={beneficiary.phone} onChange={(e) => setBeneficiary({ ...beneficiary, phone: e.target.value })} /></label>
              <label>Mode de réception
                <select value={beneficiary.mode} onChange={(e) => setBeneficiary({ ...beneficiary, mode: e.target.value })}>
                  <option>Mobile Money</option><option>Compte bancaire</option><option>Cash Pickup</option>
                </select>
              </label>
              <label>Montant ({from.currency})<input type="number" value={beneficiary.amount} onChange={(e) => setBeneficiary({ ...beneficiary, amount: Number(e.target.value) })} /></label>
            </div>
            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Retour</button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>Suivant →</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2>Récapitulatif de votre transfert</h2>
            <div className="recap-row"><span>Pays</span><b>{from.name} → {to.name}</b></div>
            <div className="recap-row"><span>Bénéficiaire</span><b>{beneficiary.name} ({beneficiary.phone})</b></div>
            <div className="recap-row"><span>Montant envoyé</span><b>{beneficiary.amount.toLocaleString("fr-FR")} {from.currency}</b></div>
            <div className="recap-row"><span>Frais (1,5%)</span><b>{fee.toLocaleString("fr-FR")} {from.currency}</b></div>
            <div className="recap-row"><span>Montant reçu (estimé)</span><b>{received.toLocaleString("fr-FR")} {to.currency}</b></div>
            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(3)}>← Retour</button>
              <button className="btn btn-primary" disabled={submitting} onClick={handleConfirm}>
                {submitting ? "Envoi…" : "Confirmer le transfert"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
