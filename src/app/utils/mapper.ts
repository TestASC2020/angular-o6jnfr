export class Mapper {
  
  static CvListResponseMapper(listCvData: Array<any>) {
    return listCvData.map(this.CvResponseMapper);
  }

  static CvResponseMapper(cvData: any) {
    let co_authors = [];
    if (cvData['authors'] && cvData['authors']['co'] && cvData['authors'] && cvData['authors']['co'].length > 0) {
      const cos = cvData['authors']['co'];
      cos.forEach(co => {
        co_authors.push({
          id: (co['id']) ? co['id'] : '',
          name: (co['name']) ? co['name'] : ''
        });
      });
    }
    co_authors = co_authors.sort((a, b) => a.name - b.name);
    const curriculum = {
      id: (cvData['id']) ? cvData['id'] : '',
      name: (cvData['name']) ? cvData['name'] : '',
      authors: {
        main: {
          id: (cvData['authors'] && cvData['authors']['main'] && cvData['authors']['main']['id']) ? cvData['authors']['main']['id'] : '',
          name: (cvData['authors'] && cvData['authors']['main'] && cvData['authors']['main']['name']) ? cvData['authors']['main']['name'] : ''
        },
        co: co_authors
      },
      status: (cvData['status']) ? cvData['status'] - 1 : 0,
      created_on: (cvData['created']) ? cvData['created'] : ''
    };

    return curriculum;
  }
}
