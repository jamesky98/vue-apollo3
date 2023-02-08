  // 下載詳細資料
  function downloadGCP(data){
    let refData = data;
    // console.log('refData',refData);
    // 標題列
    let dataStr = '點號,類型,作業編號,日期,狀態,清查人,E_this,N_this,h_this,E_latest,N_latest,h_latest\n';
    // 排序
    refData.sort(function (a, b) {
      return a.id > b.id ? 1 : -1;
    });
    // 填入資料
    for (let i = 0; i < refData.length; i++) {
      dataStr = dataStr + refData[i].id + ',';
      dataStr = (refData[i].gcp_type.type_name)?(dataStr + refData[i].gcp_type.type_name + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].ref_project.project_code)?(dataStr + refData[i].gcp_record[0].ref_project.project_code + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].date)?(dataStr + refData[i].gcp_record[0].date.split("T")[0] + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].status)?(dataStr + refData[i].gcp_record[0].status + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].person)?(dataStr + refData[i].gcp_record[0].person + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].coor_E)?(dataStr + refData[i].gcp_record[0].coor_E + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].coor_N)?(dataStr + refData[i].gcp_record[0].coor_N + ','):(dataStr + ',');
      dataStr = (refData[i].gcp_record[0].coor_h)?(dataStr + refData[i].gcp_record[0].coor_h + ','):(dataStr + ',');
      dataStr = (refData[i].latest_coor.coor_E)?(dataStr + refData[i].latest_coor.coor_E + ','):(dataStr + ',');
      dataStr = (refData[i].latest_coor.coor_N)?(dataStr + refData[i].latest_coor.coor_N + ','):(dataStr + ',');
      dataStr = (refData[i].latest_coor.coor_h)?(dataStr + refData[i].latest_coor.coor_h):(dataStr);
      dataStr = dataStr + "\n";
    }
    // console.log('dataStr',dataStr);

    //藉型別陣列建構的 blob 來建立 URL
    let fileName = "GCP_Data.csv";
    // 添加BOM讓Excel可以判斷編碼
    let blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]),dataStr], {
      type: 'text/csv;charset=utf-8',
    });
    let href = URL.createObjectURL(blob);
    // 從 Blob 取出資料
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
  }

  // 下載參考值檔
  function downloadRef(data){
    let dataStr = '';
    let refData = data;
    // console.log('refData',refData);    
    // 排序
    refData.sort(function (a, b) {
      return a.id > b.id ? 1 : -1;
    });
    // 填入資料
    for (let i = 0; i < refData.length; i++) {
      dataStr = dataStr + refData[i].id.padStart(52, " ");
      dataStr = (refData[i].gcp_record[0].coor_E)?(dataStr + refData[i].gcp_record[0].coor_E.toFixed(3).padStart(15, " ")):(dataStr + ('').padStart(15," "));
      dataStr = (refData[i].gcp_record[0].coor_N)?(dataStr + refData[i].gcp_record[0].coor_N.toFixed(3).padStart(15, " ")):(dataStr + ('').padStart(15," "));
      dataStr = (refData[i].gcp_record[0].coor_h)?(dataStr + refData[i].gcp_record[0].coor_h.toFixed(3).padStart(15, " ")):(dataStr + ('').padStart(15," "));
      dataStr = dataStr + "  50000   1.000e-001   1.000e-001   1.000e-001\n";
    }
    // console.log('dataStr',dataStr);

    //藉型別陣列建構的 blob 來建立 URL
    let fileName = "GCP.dat";
    // 添加BOM讓Excel可以判斷編碼
    let blob = new Blob([dataStr], {
      type: "application/octet-stream",
    });
    let href = URL.createObjectURL(blob);
    // 從 Blob 取出資料
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
  }


export { downloadGCP, downloadRef };