export function startChat(req, res) {
  try {
    res.status(200).send("ok");
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

export function chat(req, res) {
  try {
    res.status(200).send("ok");
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}
