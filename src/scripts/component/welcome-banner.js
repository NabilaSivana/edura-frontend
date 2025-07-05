const WelcomeBanner = (name = "User") => {
  const wrapper = document.createElement("div");
  wrapper.className =
    "bg-[#597EB5] text-white rounded-xl p-6 flex items-center justify-between mt-[1px]";

  const textWrapper = document.createElement("div");

  const heading = document.createElement("h1");
  heading.className = "text-2xl md:text-3xl font-bold";
  heading.textContent = `Hello, ${name}`;

  const subtext = document.createElement("p");
  subtext.className = "text-sm md:text-base mt-1";
  subtext.textContent =
    "Welcome Back, It’s time to get back and start learning new Course";

  textWrapper.appendChild(heading);
  textWrapper.appendChild(subtext);

  const image = document.createElement("img");
  image.src = "/maskot3.png";
  image.alt = "robot";
  image.className = "w-20 h-20 md:w-24 md:h-24 rounded-full";

  wrapper.appendChild(textWrapper);
  wrapper.appendChild(image);

  return wrapper;
};
export default WelcomeBanner;