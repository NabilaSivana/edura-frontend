const WrapperLayout = (content) => {
  return `
    <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-white">

      ${content}
    </div>
  `;
};

export default WrapperLayout;
