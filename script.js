document.getElementById("year").textContent = new Date().getFullYear();

async function submitBookingRequest(event) {
  event.preventDefault();
  const form = event.target;
  const status =
    form.querySelector("#booking-status") ||
    document.getElementById("form-note");
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Request failed");
    form.reset();
    if (status)
      status.textContent =
        "Request received. Madison Oil Medic will review and contact you to confirm.";
  } catch (error) {
    const smsBody =
      encodeURIComponent(`Hi Madison Oil Medic, I want to request service.
Name: ${data.name || ""}
Phone: ${data.phone || ""}
Vehicle: ${data.vehicle || ""}
Service: ${data.service || ""}
City: ${data.city || ""}
Preferred time: ${data.preferred_time || data.preferred_date || ""}
Notes: ${data.message || ""}`);
    if (status)
      status.textContent =
        "Online request is not connected yet. Opening text message backup.";
    window.location.href = `sms:+16080000000?&body=${smsBody}`;
  }
}
