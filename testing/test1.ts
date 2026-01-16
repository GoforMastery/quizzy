const QUIZ_URL = 'https://opentdb.com/api.php?amount=10';
async function fetchData(url: string) {
  const response = await fetch(url);
  const jsonData = await response.json();
  // what jsonData is returning is json of response code and results array
  //   console.log(jsonData);
  console.log(jsonData.results);
  // this is results array......
}
fetchData(QUIZ_URL);
