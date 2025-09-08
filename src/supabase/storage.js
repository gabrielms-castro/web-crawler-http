async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('html-data').upload('./example.html', file, {
    contentType: 'text/html',
  })
  if (error) {
    console.log("Something wrong happened")
  } else {
    console.log("File sent")
  }
  console.log(data)
}

const fileContent = await fs.promises.readFile("./example.html")
uploadFile(fileContent)