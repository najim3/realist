export const welcome = (req, res) => {
  res.json({
    data: "hello from nodejs api from routes...",
  });
};

export const preRegister = async (req, res) => {
  // create jwt with email and password then email as clickable link
  // only when user click on that email link, registation completes.
  try {
    console.log(req.body);

    const emailSent = false;
    if (emailSent) {
      return res.json({ ok: true });
    } else {
      return res.json({ ok: false });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong. Try again." });
  }
};
