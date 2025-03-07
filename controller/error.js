exports.get404Page = (req, res) => {
  //   res.status(404).sendFile(path.join(__dirname, "views", "notFound.html"));
  res.status(404).render("404", {
    pageTitle: "Page not found",
    path: "/404",
  });
};
