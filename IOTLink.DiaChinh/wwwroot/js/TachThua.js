﻿var TachThua = {
    GLOBAL: {
        ThuaDat: null,
        polygon: null,
        path: null,
        listMarkerDiem: [],
        listDiem: [],
        listKetQuaGhiNhan:[],
        maptachthua: null,
        listPolygonTachThua: null,
        listDrawPolygon: [],
        listInforUpdateTachThua: [],
        codeMaXaThuaDat: "",
        polylineGhiNhan: null,
        listSortKetQuaGhiNhan:[],
    },
    CONSTS: {},
    SELECTORS: {
        checkGiaoHoi: ".giao-hoi",
        modalTachThua: ".modal-tach-thua",
        btnTachThua: ".btn-tach-thua",
        formGiaoHoi: ".form-giao-hoi",
        noteGiaoHoi: ".note-giao-hoi",
        menuCachDuongThang: ".menu-cach-duong-thang",
        menuHoiThuan: ".menu-hoi-thuan",
        menuHoiNghich: ".menu-hoi-nghich",
        menuHoiHuong: ".menu-hoi-huong",
        menuDocTheoCanh: ".menu-doc-theo-canh",
        selectDinhA: "#sel_GHCDTDinhA",
        selectDinhB: "#sel_GHCDTDinhB",
        selectDinhC: "#sel_GHCDTDinhC",
        selectDinhD: "#sel_GHCDTDinhD",
        inputCachAB: "#inp_CachAB",
        inputCachCD: "#inp_CachCD",
        inputCachAC: "#inp_CanhAC",
        inputCachBC: "#inp_CanhBC",
        inputGocCAB: "#inp_GocCAB",
        inputGocCBA: "#inp_GocCBA",
        inputGocAPB: "#inp_GocAPB",
        inputGocAPC: "#inp_GocAPC",
        inputKhoangCach: "#inp_KhoangCach",
        radioGiaoHoiThuan: "input[name='loaiGiaoHoiThuan']",
        radioGiaoHoiThuanCheck: "input[name='loaiGiaoHoiThuan']:checked",
        radioTuDiem: "input[name='rad_tudiem']",
        radioTuDiemCheck: "input[name='rad_tudiem']:checked",
        radioDiem: "input[name='rad_diem']",
        radioDiemCheck: "input[name='rad_diem']:checked",
        titleGiaoHoi: ".title-giao-hoi",
        showHideForm: ".btn-show-hide-point",
        formPointMap: ".footer-map-point",
        viewResultTachThua: ".view-tach-thua",
        clearResultTachThua: ".clear-result",
        saveResultTachThua: ".save-tach-thua",
        clearAllPoint:".clear-all-point",
        closeInforTachThua: ".header-infor span",
        inforTachThua: ".infor-Tach-Thua",
        btnSaveInforTemp: ".btn-save-infor-temp",
        inputIdInfor: "input[name='id']",
        SoToUpdate: ".infor-Tach-Thua #text-update-soTo",
        SoThuaUpdate: ".infor-Tach-Thua #text-update-soThua",
        SoToUpdateOld: ".infor-Tach-Thua #text-update-soTo-old",
        SoThuaUpdateOld: ".infor-Tach-Thua #text-update-soThua-old",
        DienTichUpdate: ".infor-Tach-Thua #text-update-dienTich",
        DienTichPhapLyUpdate: ".infor-Tach-Thua #text-update-dienTichPhapLy",
        TenChuUpdate: ".infor-Tach-Thua #text-update-chuNha",
        DiaChiUpdate: ".infor-Tach-Thua #text-update-diaChi",
        KHList: '.infor-Tach-Thua #KH-listselectid',
        focusInput: ".infor-Tach-Thua input",
        pointGhiNhan: "#pointGhiNhan",
        pointGhiNhanChild: "#pointGhiNhan tr",
    },
    init: function () {
        maptachthua = new map4d.Map(document.getElementById("madTachThua"), {
            zoom: 15,
            center: { lat: 10.678087311284315, lng: 105.08063708265138 },
            geolocate: true,
            minZoom: 3,
            maxZoom: 22,
            tilt: 0,
            controls: true,
            controlOptions: map4d.ControlOptions.TOP_RIGHT,
            accessKey: "208e1c99aa440d8bc2847aafa3bc0669",
        });
        TachThua.GLOBAL.maptachthua = maptachthua
        maptachthua.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
        maptachthua.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png", true);
        maptachthua.setPlacesEnabled(false);
        maptachthua.setTileFeatureVisible(false, false)
        //$(TachThua.SELECTORS.modalTachThua).modal({ backdrop: 'static', keyboard: false });
        TachThua.setEvent();
    },
    setEvent: function () {
        $(TachThua.SELECTORS.pointGhiNhan).sortable({
            stop: function (event, ui) {
                TachThua.sortPointResult();
            }
        });
        $('.menu-tach-thua ul li a').click(function () {
            $('li a').removeClass("active");
            $(this).addClass("active");
        });
        $(TachThua.SELECTORS.btnTachThua).on("click", function () {
            TachThua.GLOBAL.codeMaXaThuaDat = ViewMap.GLOBAL.commonData.features[0].properties.MaXa;
            let soto = ViewMap.GLOBAL.commonData.features[0].properties.SoHieuToBanDo;
            let sothua = ViewMap.GLOBAL.commonData.features[0].properties.SoThuTuThua;
            TachThua.showTachThua(TachThua.GLOBAL.codeMaXaThuaDat, soto, sothua);
            setTimeout(function () {
                if (TachThua.GLOBAL.path === null) {
                    let feature = TachThua.GLOBAL.ThuaDat.features[0];
                    TachThua.GLOBAL.path = TachThua.convertCoordinate(feature);
                }
                TachThua.fitBoundsThuaDat(TachThua.GLOBAL.path);
                var camera = maptachthua.getCamera();
                let zoom = camera.getZoom();
                camera.setZoom(zoom - 1);
                maptachthua.setCamera(camera);
                TachThua.setMarkerDiem(TachThua.GLOBAL.ThuaDat);
            }, 1000);
            $(TachThua.SELECTORS.modalTachThua).modal('show');
        });
        $(TachThua.SELECTORS.modalTachThua).on('hide.bs.modal', function () {
            TachThua.removeMaker();
            TachThua.removerOptionDiem([1, 2, 3, 4]);
            TachThua.ShowHideAll(false);
            TachThua.GLOBAL.listKetQuaGhiNhan = [];
            updateListGhiNhan();
        });
        $(TachThua.SELECTORS.modalTachThua).on('show.bs.modal', function () {
            setTimeout(function () {
                $(TachThua.SELECTORS.menuCachDuongThang).trigger("click");
            }, 1000);
        });
        $(TachThua.SELECTORS.menuCachDuongThang).on("click", function () {
            TachThua.showHtmlGiaoHoi(1);
            TachThua.setEventChangeAllDiem(1);
        });
        $(TachThua.SELECTORS.menuHoiThuan).on("click", function () {
            TachThua.showHtmlGiaoHoi(2);
            $(TachThua.SELECTORS.radioGiaoHoiThuan).change(function () {
                let check = $(TachThua.SELECTORS.radioGiaoHoiThuanCheck).val();
                if (check === "angle") {
                    $(TachThua.SELECTORS.inputGocCAB).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputGocCBA).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputCachAC).attr("disabled", "");
                    $(TachThua.SELECTORS.inputCachBC).attr("disabled", "");
                }
                if (check === "edge") {
                    $(TachThua.SELECTORS.inputGocCAB).attr("disabled", "");
                    $(TachThua.SELECTORS.inputGocCBA).attr("disabled", "");
                    $(TachThua.SELECTORS.inputCachAC).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputCachBC).removeAttr("disabled");
                }
            });
            TachThua.setEventChangeAllDiem(2);
        });
        $(TachThua.SELECTORS.menuHoiNghich).on("click", function () {
            TachThua.showHtmlGiaoHoi(3);
            TachThua.setEventChangeAllDiem(3);
        });
        $(TachThua.SELECTORS.menuHoiHuong).on("click", function () {
            TachThua.showHtmlGiaoHoi(4);
            TachThua.setEventChangeAllDiem(4);
        });
        $(TachThua.SELECTORS.menuDocTheoCanh).on("click", function () {
            TachThua.showHtmlGiaoHoi(5);
            TachThua.setEventChangeAllDiem(5);
        });
        $(TachThua.SELECTORS.showHideForm).on("click", function () {
            let hide = $(TachThua.SELECTORS.formPointMap).hasClass("footerHide");
            if (hide) {
                $(TachThua.SELECTORS.formPointMap).removeClass("footerHide");
                $(TachThua.SELECTORS.formPointMap).addClass("footerShow");
                $(this).find("i").removeClass("fa-chevron-up");
                $(this).find("i").addClass("fa-chevron-down");
            } else {
                $(TachThua.SELECTORS.formPointMap).addClass("footerHide");
                $(TachThua.SELECTORS.formPointMap).removeClass("footerShow");
                $(this).find("i").removeClass("fa-chevron-down");
                $(this).find("i").addClass("fa-chevron-up");
            }

        });
        $(TachThua.SELECTORS.viewResultTachThua).on("click", function () {
            TachThua.sortPointResult();
            if (TachThua.GLOBAL.listKetQuaGhiNhan.length > 1) {
                var listp = [];
                for (var i = 0; i < TachThua.GLOBAL.listKetQuaGhiNhan.length; i++) {
                    let objVN2000 = TachThua.GLOBAL.listKetQuaGhiNhan[i].diem2000;
                    let xy = {
                        x: objVN2000[1],
                        y: objVN2000[0]
                    };
                    listp.push(xy);
                }
                //var listp = [{ "x": 1181000.3288308799, "y": 537085.5774804119 }, { "x": 1181035.395258569, "y": 537067.3979677357 }]
                TachThua.GLOBAL.listPolygonTachThua = TachThua.getPolygonsTachThua(listp);
                if (TachThua.GLOBAL.listPolygonTachThua.length > 0) {
                    TachThua.drawPolygonTachThua(TachThua.GLOBAL.listPolygonTachThua);
                    TachThua.ShowHideAll(true);
                    TachThua.removeDrawPolylineDiem();
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Điểm không hợp lệ để tách thửa!",
                        icon: "warning",
                        buttons: "Đóng",
                        dangerMode: true,
                    })
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Số điểm quá ít để tách thửa!",
                    icon: "warning",
                    buttons: "Đóng",
                    dangerMode: true,
                })
            }
        });
        $(TachThua.SELECTORS.clearResultTachThua).on("click", function () {
            TachThua.ShowHideAll(false);
            TachThua.drawPolylineDiem(TachThua.GLOBAL.listSortKetQuaGhiNhan);
        });
        $(TachThua.SELECTORS.closeInforTachThua).on("click", function () {
            TachThua.showInforUpdateTachThua(false);
        });
        $(TachThua.SELECTORS.btnSaveInforTemp).on("click", function () {
            if (TachThua.checkFormInfor()) {
                let id = $(TachThua.SELECTORS.inputIdInfor).val();
                let maxa = TachThua.GLOBAL.ThuaDat.features[0].properties.MaXa;
                TachThua.setInforUpdateTachThua(id, maxa);
            }
        });
        $(TachThua.SELECTORS.focusInput).on("click", function () {
            $(this).parent().removeClass("has-error");
        });
        $(TachThua.SELECTORS.saveResultTachThua).on("click", function () {
            if (TachThua.GLOBAL.listPolygonTachThua !== null && TachThua.GLOBAL.listInforUpdateTachThua.length === TachThua.GLOBAL.listPolygonTachThua.length && TachThua.GLOBAL.listInforUpdateTachThua.length > 0) {
                let fromFeatures = TachThua.GLOBAL.ThuaDat.features[0].properties.info === "vn2000" ? TachThua.GLOBAL.ThuaDat.features[0] : TachThua.GLOBAL.ThuaDat.features[1];
                let ThuaDatFrom = {
                    id: fromFeatures.properties.Id,
                    objectId: fromFeatures.properties.ObjectId,
                    uuid: fromFeatures.properties.UUID,
                    thoiDiemBatDau: fromFeatures.properties.ThoiDiemBatDau,
                    thoiDiemKetThuc: fromFeatures.properties.ThoiDiemKetThuc,
                    maXa: fromFeatures.properties.MaXa,
                    maDoiTuong: fromFeatures.properties.MaDoiTuong,
                    soHieuToBanDo: fromFeatures.properties.SoHieuToBanDo,
                    soThuTuThua: fromFeatures.properties.SoThuTuThua,
                    soHieuToBanDoCu: fromFeatures.properties.SoHieuToBanDoCu,
                    soThuTuThuaCu: fromFeatures.properties.SoThuTuThuaCu,
                    dienTich: fromFeatures.properties.DienTich,
                    dienTichPhapLy: fromFeatures.properties.DienTichPhapLy,
                    kyHieuMucDichSuDung: fromFeatures.properties.KyHieuMucDichSuDung,
                    kyHieuDoiTuong: null,
                    tenChu: fromFeatures.properties.TenChu,
                    diaChi: fromFeatures.properties.DiaChi,
                    daCapGCN: 0,
                    tenChu2: fromFeatures.properties.TenChu2,
                    namSinhC1: fromFeatures.properties.NamSinhC1,
                    soHieuGCN: fromFeatures.properties.SoHieuGCN,
                    soVaoSo: fromFeatures.properties.SoVaoSo,
                    ngayVaoSo: fromFeatures.properties.NgayVaoSo,
                    soBienNhan: fromFeatures.properties.SoBienNhan,
                    nguoiNhanHS: fromFeatures.properties.NguoiNhanHS,
                    coQuanThuLy: fromFeatures.properties.CoQuanThuLy,
                    loaiHS: fromFeatures.properties.LoaiHS,
                    maLienKet: fromFeatures.properties.MaLienKet,
                    shapeSTArea: fromFeatures.properties.ShapeSTArea,
                    shapeSTLength: fromFeatures.properties.ShapeSTLength,
                    shapeLength: fromFeatures.properties.ShapeLength,
                    shapeArea: fromFeatures.properties.ShapeArea,
                    geometry: fromFeatures.geometry,
                    tags: {}
                };
                let inforUpdate = {
                    from: ThuaDatFrom,
                    to: TachThua.GLOBAL.listInforUpdateTachThua
                };
                swal({
                    title: "Thông báo",
                    text: "Bạn có chắc chắn lưu thông tin và thửa đất đã tách thửa!",
                    icon: "warning",
                    buttons: [
                        'Hủy',
                        'Lưu lại'
                    ],
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        console.log("tach thưa:", JSON.stringify(inforUpdate));
                        TachThua.saveInforTachThua(inforUpdate);
                    }
                });
            } else {
                swal({
                    title: "Thông báo",
                    text: "Chưa cập nhật thông tin đất!",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
            }
        });
        $(TachThua.SELECTORS.clearAllPoint).on("click", function () {
            TachThua.removeDrawPolylineDiem();
            TachThua.GLOBAL.listKetQuaGhiNhan = [];
            updateListGhiNhan();
        });
        maptachthua.addListener("click", (args) => {
            let id = args.polygon.id;
            $(TachThua.SELECTORS.inputIdInfor).val(id);
            TachThua.addRemoveInforTachThua(id);
            TachThua.showInforUpdateTachThua(true);
            $(TachThua.SELECTORS.formPointMap).addClass("footerHide");
            $(TachThua.SELECTORS.formPointMap).removeClass("footerShow");
            $(this).find("i").removeClass("fa-chevron-down");
            $(this).find("i").addClass("fa-chevron-up");
        }, { polygon: true });
    },
    showTachThua: function (code, soto,sothua) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: code,
                soTo: soto,
                soThua: sothua,
                //objectId: objectId,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                if (data.result !== null && typeof data.result !== "undefined") {
                    console.log("lodat-select:", JSON.stringify(data.result));
                    if (data.result.features.length > 0) {
                        TachThua.GLOBAL.ThuaDat = data.result;
                        let path = TachThua.drawPolygon(TachThua.GLOBAL.ThuaDat);
                    } else {
                        bootbox.alert("Phường/Xã này chưa có dữ liệu");
                    }
                } else {
                    bootbox.alert("Lỗi hệ thống");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    drawPolygon: function (data) {
        let feature = data.features[0];
        let paths = TachThua.convertCoordinate(data.features[0]);
        if (TachThua.GLOBAL.polygon !== null) {
            TachThua.GLOBAL.polygon.setMap(null);
        }
        TachThua.GLOBAL.polygon = new map4d.Polygon({
            paths: paths,
            fillColor: "#0000ff",
            fillOpacity: 0,
            strokeColor: "#ea5252",
            strokeOpacity: 1.0,
            strokeWidth: 1,
            userInteractionEnabled: false,
        });
        TachThua.GLOBAL.polygon.setMap(maptachthua);
        TachThua.GLOBAL.path = paths;
        //TachThua.fitBoundsThuaDat(paths);
        //return paths;
        //maptachthua.fitBounds(paths[0]);
        //var camera = maptachthua.getCamera();
        //let zoom = camera.getZoom();
        //camera.setZoom(zoom - 1);
        //maptachthua.setCamera(camera);
    },
    convertCoordinate: function (data) {
        let res = [];
        if (data.geometry.type.toLocaleLowerCase() === "polygon") {
            //let lenght = data.geometry.coordinates.length;
            return data.geometry.coordinates;
        }
        if (data.geometry.type.toLocaleLowerCase() === "multipolygon") {
            let lenght = data.geometry.coordinates[0].length;
            for (var i = 0; i < lenght; i++) {
                let datatemp = data.geometry.coordinates[0][i];
                res.push(datatemp);
            }
            return res;
        }

    },
    fitBoundsThuaDat: function (data) {
        let latLngBounds = new map4d.LatLngBounds();
        let paddingOptions = {
            top: 10,
            bottom: 50,
            left: 50,
            right: 50
        };

        for (var i = 0; i < data[0].length; i++) {
            latLngBounds.extend(data[0][i]);
        }
        maptachthua.fitBounds(latLngBounds);
    },
    showHtmlGiaoHoi: function (giaohoi) {
        let html = "";
        let note = "";
        $(TachThua.SELECTORS.formGiaoHoi).children().remove();
        $(TachThua.SELECTORS.noteGiaoHoi).children().remove();
        switch (giaohoi) {
            case 1:
                // giao hoi cách đường thẳng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoicachduongthang" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhD"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách AB</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_CachAB">
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách CD</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_CachCD">
                                </div>
                            </div></div>
                            <div class="col-xs-12 col-sm-2">
                                <div class="chon-diem">
                                </div>
                            </div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghcachduongthang.png" data-holder-rendered="true" style="width: 100%; display: block;">
                        <div class="caption">
                            <p>Lấy ra điểm cách đường AB, CD lần lượt các khoảng là d1 và d2. Kết quả sẽ thu được là 4 điểm 1,2,3,4.</p>
                        </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputCachAB).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachCD).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội cách đường thẳng")
                break;
            case 2:
                // giao hội thuận
                html = `<div class="col-xs-12 col-sm-8"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoithuan" style="display:none" />
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh A-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance" placeholder="Độ dài cạnh (m)" id="inp_CanhAC">
                            </div>

                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh B-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance" placeholder="Độ dài cạnh (m)" id="inp_CanhBC">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CAB</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocCAB" disabled="">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CBA</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocCBA" disabled="">
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="phuong-thuc-giao-hoi-thuan">
                                <label class="control-label bolder blue">Giao hội theo</label>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuan" type="radio" class="ace" value="edge" checked>
                                        <span class="lbl"> Cạnh</span>
                                    </label>
                                </div>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuan" type="radio" class="ace" value="angle">
                                        <span class="lbl"> Góc</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="chon-diem">
                            </div>
                        </div>`;
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/ghthuan.png" data-holder-rendered="true" style="width: 75%; display: block;">
                            <div class="caption">
                                <p>Từ hai đỉnh đã biết tọa độ cộng thêm hai số đo khác của tam giác giao hội, ta có thể tính được tọa độ điểm giao hội. Bài toán giao hội thuận luôn thu được hai kết quả: đỉnh C ở bên trái hay C' ở bên phải so với hướng cạnh gốc AB.</p>
                            </div>`;

                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputCachAC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachBC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputGocCAB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocCBA).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội thuận")
                break;
            case 3:
                // giao hội nghịch
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoinghich" style="display:none" />
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APB</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocAPB">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APC</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocAPC">
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="chon-diem">
                            </div>
                        </div>`;
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/GiaoHoiNghich_3DiemGoc.png" data-holder-rendered="true" style="width: 60%; display: block;">
                                <div class="caption">
                                    <p>Từ ba đỉnh đã biết tọa độ cộng thêm hai số đo góc từ điểm giao hội P ngắm về ABC, ta xác định được tọa độ điểm giao hội P. Góc giao hội sử dụng để tính toán là các góc ngược chiều kim đồng hồ.</p>
                                </div>`

                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputGocAPB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocAPC).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội nghịch")
                break;
            case 4:
                // giao hội hướng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoihuong" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhD"></select>
                                </div>
                            </div></div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghhuong.png" data-holder-rendered="true" style="width: 100%; display: block;">
                            <div class="caption">
                                <p>Điểm kết quả là giao điểm của hai đường thẳng AB và CD.</p>
                            </div>`;

                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội hướng")
                break;
            default:
                // giao hội dọc
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoidoctheocanh" style="display:none" />
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Khoảng cách</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_KhoangCach">
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-2">
                                    <div class="control-group">
                                        <div class="radio">
                                            <label>
                                                <input name="rad_tudiem" type="radio" class="ace" value="A" checked>
                                                <span class="lbl"> Từ điểm A</span>
                                            </label>
                                        </div>

                                        <div class="radio">
                                            <label>
                                                <input name="rad_tudiem" type="radio" class="ace" value="B">
                                                <span class="lbl"> Từ điểm B</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div></div>`;
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghdoctheocanh.png" data-holder-rendered="true" style="width: 75%; display: block;">
                            <div class="caption">
                                <p>Lấy một điểm C trên đường thẳng AB cách đỉnh A hoặc đỉnh B một khoảng d.</p>
                            </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputKhoangCach).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội dọc theo cạnh");
        }
    },
    setMarkerDiem: function (data) {
        TachThua.GLOBAL.listDiem = [];
        let check = data.features[0].geometry.type;
        let point84 = (data.features[0].properties.info == "wgs84") ? data.features[0].geometry.coordinates[0] : data.features[1].geometry.coordinates[0];
        let point2000 = (data.features[1].properties.info == "vn2000") ? data.features[1].geometry.coordinates[0] : data.features[0].geometry.coordinates[0];
        if (check.toLowerCase() === "multipolygon") {
            for (var i = 0; i < point84.length; i++) {
                for (var j = 0; j < point84[i].length - 1; j++) {
                    let lat = point84[i][j][1];
                    let lng = point84[i][j][0];
                    let markerPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
                        anchor: [0.5, 0.5],
                        //title: name
                    });
                    //thêm marker vào map
                    markerPoint.setMap(maptachthua);
                    let countPoint = (i + j + 1).toString();
                    let markerTitelPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        anchor: [0.5, 1],
                        visible: true,
                        label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                        icon: new map4d.Icon(32, 32, "")
                    });
                    //thêm marker vào map
                    markerTitelPoint.setMap(maptachthua);
                    let marker = {
                        markerPoint: markerPoint,
                        markerTitelPoint: markerTitelPoint
                    };
                    TachThua.GLOBAL.listMarkerDiem.push(marker);
                    //add diem
                    let xVN2000 = point2000[i][j][1];
                    let yVN2000 = point2000[i][j][0];
                    let diem = {
                        id: Number(countPoint),
                        name: "Điểm " + countPoint,
                        xy: {
                            x: xVN2000,
                            y: yVN2000
                        },
                        latlng: {
                            lat: lat,
                            lng: lng
                        }
                    }
                    TachThua.GLOBAL.listDiem.push(diem);
                }
            }
        }
        if (check.toLowerCase() === "polygon") {
            for (var j = 0; j < point84.length - 1; j++) {
                let lat = point84[j][1];
                let lng = point84[j][0];
                let markerPoint = new map4d.Marker({
                    position: { lat: lat, lng: lng },
                    icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
                    anchor: [0.5, 0.5],
                    //title: name
                });
                //thêm marker vào map
                markerPoint.setMap(maptachthua);
                let countPoint = (j + 1).toString();
                let markerTitelPoint = new map4d.Marker({
                    position: { lat: lat, lng: lng },
                    anchor: [0.5, 1],
                    visible: true,
                    label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                    icon: new map4d.Icon(32, 32, "")
                });
                //thêm marker vào map
                markerTitelPoint.setMap(maptachthua);
                let marker = {
                    markerPoint: markerPoint,
                    markerTitelPoint: markerTitelPoint
                };
                TachThua.GLOBAL.listMarkerDiem.push(marker);
                //add diem
                let xVN2000 = point2000[j][1];
                let yVN2000 = point2000[j][0];
                let diem = {
                    id: Number(countPoint),
                    name: "Điểm " + countPoint,
                    xy: {
                        x: xVN2000,
                        y: yVN2000
                    },
                    latlng: {
                        lat: lat,
                        lng: lng
                    }
                }
                TachThua.GLOBAL.listDiem.push(diem);
            }
        }
    },
    removeMaker: function () {
        $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
            obj.markerPoint.setMap(null);
            obj.markerTitelPoint.setMap(null);
        });
        TachThua.GLOBAL.listMarkerDiem = [];
    },
    setEventChangeAllDiem: function (check) {
        let listSelectPoint = [];
        let html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
        $(TachThua.SELECTORS.selectDinhA).append(html);
        $(TachThua.SELECTORS.selectDinhA).change(function () {
            listSelectPoint = [];
            listSelectPoint.push(Number($(this).val()));
            if (check == 1 || check == 2 || check == 5) {
                let pointselect = Number($(this).val()) - 1;
                let listDiem = TachThua.GLOBAL.listDiem;
                let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                let listDinhB = [pointStart, pointEnd];
                TachThua.removerOptionDiem([2, 3, 4])
                html = TachThua.getHtmlSelectDiem(listDinhB, false);
                $(TachThua.SELECTORS.selectDinhB).append(html);
            } else {
                TachThua.removerOptionDiem([2, 3, 4])
                html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                $(TachThua.SELECTORS.selectDinhB).append(html);
            }
        });
        if (check == 1 || check == 3 || check == 4) {
            $(TachThua.SELECTORS.selectDinhB).change(function () {
                TachThua.removerOptionDiem([3, 4])
                listSelectPoint.push(Number($(this).val()));
                html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                $(TachThua.SELECTORS.selectDinhC).append(html);
            });
        }
        if (check == 1 || check == 4) {
            $(TachThua.SELECTORS.selectDinhC).change(function () {
                if (check == 1) {
                    let pointselect = Number($(this).val()) - 1;
                    let listDiem = TachThua.GLOBAL.listDiem;
                    let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                    let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                    let listDinhD = [];
                    if (listSelectPoint.includes(pointStart) == false) listDinhD.push(pointStart);
                    if (listSelectPoint.includes(pointEnd) == false) listDinhD.push(pointEnd);
                    TachThua.removerOptionDiem([4])
                    html = TachThua.getHtmlSelectDiem(listDinhD, false);
                    $(TachThua.SELECTORS.selectDinhD).append(html);
                } else {
                    TachThua.removerOptionDiem([4])
                    listSelectPoint.push(Number($(this).val()));
                    html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                    $(TachThua.SELECTORS.selectDinhD).append(html);
                }

            });
        }
    },
    getHtmlSelectDiem: function (listPointSelected, check) {
        let str = '<option selected>- Chọn điểm -</option>';
        if (TachThua.GLOBAL.listDiem != null && TachThua.GLOBAL.listDiem.length > 0) {
            let list = TachThua.GLOBAL.listDiem;

            for (var i = 0; i < list.length; i++) {
                if (check) {
                    if (listPointSelected.includes(list[i].id) == false) {
                        str += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                    }
                } else {
                    if (listPointSelected.includes(list[i].id) == true) {
                        str += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                    }
                }
            }
            //} else {
            //    for (var i = 0; i < listPointSelected.length; i++) {
            //        let obj = list[];
            //        str += '<option value="' + obj.id + '">' + obj.name + '</option>';
            //    }
            //}

        }
        return str;
    },
    removerOptionDiem: function (check) {
        if (check.includes(1)) $(TachThua.SELECTORS.selectDinhA).children().remove();
        let select = $(TachThua.SELECTORS.selectDinhB);
        if (check.includes(2) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhB).children().remove();
        }
        select = $(TachThua.SELECTORS.selectDinhC);
        if (check.includes(3) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhC).children().remove();
        }
        select = $(TachThua.SELECTORS.selectDinhD);
        if (check.includes(4) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhD).children().remove();
        }
    },
    checkPointOnLine: function (A, B, C) {
        let AB = (B.y - A.y) / (B.x - A.x);
        let AC = (B.y - C.y) / (B.x - C.x);
        AB = Math.round(AB * 10000) / 10000;
        AC = Math.round(AC * 10000) / 10000;
        if ((A.x > B.x && A.x > C.x && C.x > B.x) || (B.x > A.x && B.x > C.x && C.x > A.x)) {
            if ((A.y > B.y && A.y > C.y && C.y > B.y) || (B.y > A.y && B.y > C.y && C.y > A.y)) {
                if (AB === AC) {
                    return true;
                }
            }
        }
        return false;
    },
    orderClockWise: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj.y;
            mY = mY + obj.x;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a.x - mY, a.y - mX));
            let at2 = (Math.atan2(b.x - mY, b.y - mX));
            return at1 - at2;
        });
        return listTemp;
    },
    orderClockWiseWGS84: function  (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj[0];//obj.lng;
            mY = mY + obj[1];//obj.lat;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a[1] - mY, a[0] - mX));//(Math.atan2(a.lat - mY, a.lng - mX));
            let at2 = (Math.atan2(b[1] - mY, b[0] - mX));//(Math.atan2(b.lat - mY, b.lng - mX));
            return at1 - at2;
        });
        return listTemp;
    },
    checkListPointWithPolygon: function (listPoint, listDiem) {
        if (listPoint.length > 1) {
            var Polygon1 = [];
            var Polygon2 = [];
            var pointStart, pointEnd;
            let a, b, c;
            let diem1 = false, diem2 = false;
            for (var i = 0; i < listDiem.length; i++) {
                //polygon1
                if ((!diem1 && !diem2) || (diem1 && diem2)) {
                    Polygon1.push(listDiem[i]);
                }
                //polygon 2
                if (diem1 && !diem2) {
                    Polygon2.push(listDiem[i]);
                }
                for (var j = 0; j < listPoint.length; j++) {
                    a = listDiem[i].xy;
                    if (i === listDiem.length - 1) {
                        b = listDiem[0].xy;
                    } else {
                        b = listDiem[i + 1].xy;
                    }
                    c = listPoint[j];
                    if (TachThua.checkPointOnLine(a, b, c)) {
                        if (!diem2 && diem1) diem2 = true;
                        if (!diem1) diem1 = true;
                        break;
                    }
                }
            }
            if ((diem1 && diem2)) {
                //console.log(listpolygon1);
                //console.log(listpolygon2);
                var listpolygon1 = [];
                for (var i = 0; i < Polygon1.length; i++) {
                    listpolygon1.push(Polygon1[i].xy);
                }
                var listpolygon2 = [];
                for (var i = 0; i < Polygon2.length; i++) {
                    listpolygon2.push(Polygon2[i].xy);
                }
                if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 0) {
                    if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length <= 2) {
                        $.each(TachThua.GLOBAL.listSortKetQuaGhiNhan, function (i, obj) {
                            listpolygon1.push(listPoint[obj]);
                            listpolygon2.push(listPoint[obj]);
                        });
                    } else if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 2) {
                        let countStart = TachThua.GLOBAL.listSortKetQuaGhiNhan[0];
                        let countEnd = TachThua.GLOBAL.listSortKetQuaGhiNhan[TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1];
                        pointStart = listPoint[countStart];
                        pointEnd = listPoint[countEnd];
                        listpolygon1.push(pointStart);
                        listpolygon1.push(pointEnd);
                        listpolygon2.push(pointStart);
                        listpolygon2.push(pointEnd);
                    }
                } else {
                    if (listPoint.length <= 2) {
                        for (var i = 0; i < listPoint.length; i++) {
                            listpolygon1.push(listPoint[i]);
                            listpolygon2.push(listPoint[i]);
                        }
                    } else if (listPoint.length >= 2) {
                        let countStart = listPoint[0];
                        let countEnd = listPoint[listPoint.length - 1];
                        pointStart = listPoint[countStart];
                        pointEnd = listPoint[countEnd];
                        listpolygon1.push(pointStart);
                        listpolygon1.push(pointEnd);
                        listpolygon2.push(pointStart);
                        listpolygon2.push(pointEnd);
                    }
                }
                
                var listPolygons = [];
                listPolygons.push(TachThua.orderClockWise(listpolygon1));
                listPolygons.push(TachThua.orderClockWise(listpolygon2));
                if (listPoint.length > 2) {
                    for (var z = 0; z< listPolygons.length; z++) {
                        let listpolygonConvert = listPolygons[z];
                        for (var i = 0; i < listpolygonConvert.length; i++) {
                            let count = i;
                            if (listpolygonConvert[i].x === pointStart.x && listpolygonConvert[i].y === pointStart.y) {
                                //TH 1 liên kề đầu cuối
                                if (listpolygonConvert[i + 1].x === pointEnd.x && listpolygonConvert[i + 1].y === pointEnd.y) {
                                    for (var j = 1; j < TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1; j++) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                }
                                //TH 2 2điểm ở đầu và cuối
                                else if (listpolygonConvert[listpolygonConvert.length - 1].x === pointEnd.x && listpolygonConvert[listpolygonConvert.length - 1].y === pointEnd.y) {
                                    count = listpolygonConvert.length - 1;
                                    for (var j = TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 2; j >0; j--) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                }
                            }
                            if (listpolygonConvert[i].x === pointEnd.x && listpolygonConvert[i].y === pointEnd.y) {
                                //TH 3 2điểm liền kề cuối  -> đầu
                                if (listpolygonConvert[i + 1].x === pointStart.x && listpolygonConvert[i + 1].y === pointStart.y) {
                                    for (var j = TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 2; j > 0; j--) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                } else // TH 4 2điểm ở cuối và đầu
                                    if (listpolygonConvert[listpolygonConvert.length - 1].x === pointStart.x && listpolygonConvert[listpolygonConvert.length - 1].y === pointStart.y) {
                                    count = listpolygonConvert.length - 1;
                                    for (var j = 1; j < TachThua.GLOBAL.listSortKetQuaGhiNhan.length - 1; j++) {
                                        count = count + 1;
                                        listpolygonConvert.splice(count, 0, listPoint[TachThua.GLOBAL.listSortKetQuaGhiNhan[j]]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                return listPolygons;
            }
            return [];
        }
    },
    convertDataVN2000toWGS84: function (object) {
        let data = {
            code: TachThua.GLOBAL.codeMaXaThuaDat,
            geometry: {
                type: "Polygon",
                coordinates: []
            }
        };
        data.geometry.coordinates.push(object);
        var result;
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/vn2000-wgs84?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json-patch+json',
            async: false,
            success: function (data) {
                result = data.result;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
        return result;
    },
    getPolygonsTachThua: function (listpoint) {
        var list = TachThua.checkListPointWithPolygon(listpoint, TachThua.GLOBAL.listDiem);
        var listWGS84 = [];
        $.each(list, function (i, obj) {
            let polygon = [];
            for (var i = 0; i < obj.length; i++) {
                let point = [];
                point.push(obj[i].y);
                point.push(obj[i].x);
                polygon.push(point);
            }
            let polygonconvert = TachThua.convertDataVN2000toWGS84(polygon);
            listWGS84.push(polygonconvert);
        });
        return listWGS84;
    },
    ShowHideAll: function (check) {
        if (check) {
            TachThua.GLOBAL.polygon.setMap(null);
            $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
                obj.markerPoint.setMap(null);
                obj.markerTitelPoint.setMap(null);
            });
        }
        else {
            TachThua.GLOBAL.polygon.setMap(maptachthua);
            $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
                obj.markerPoint.setMap(maptachthua);
                obj.markerTitelPoint.setMap(maptachthua);
            });
            $.each(TachThua.GLOBAL.listDrawPolygon, function (i, obj) {
                obj.setMap(null);
            });
            TachThua.GLOBAL.listDrawPolygon = [];
            TachThua.GLOBAL.listInforUpdateTachThua = [];
        }
    },
    drawPolygonTachThua: function (list) {
        for (var i = 0; i < list.length; i++) {
            let feature = list[i].features;
            for (var j = 0; j < feature.length; j++) {
                if (feature[j].properties.info === "wgs84") {
                    let paths = feature[j].geometry.coordinates;
                    paths[0].push(paths[0][0]);
                    if (TachThua.GLOBAL.polygon !== null) {
                        TachThua.GLOBAL.polygon.setMap(null);
                    }
                    let polygon = new map4d.Polygon({
                        paths: paths,
                        fillColor: "#d8eefb",
                        fillOpacity: 0.5,
                        strokeColor: "#ea5252",
                        strokeOpacity: 1.0,
                        strokeWidth: 1,
                    });
                    TachThua.GLOBAL.listDrawPolygon.push(polygon);
                    polygon.setMap(maptachthua);
                    feature[j].properties.id = polygon.id;
                }
                if (feature[j].properties.info === "vn2000") {
                    let paths = feature[j].geometry.coordinates;
                    paths[0].push(paths[0][0]);
                }
            }
        }
    },
    showInforUpdateTachThua: function (check) {
        if (check) {
            $(TachThua.SELECTORS.inforTachThua).removeClass("headerHide");
            $(TachThua.SELECTORS.inforTachThua).addClass("headerShow");
        } else {
            $(TachThua.SELECTORS.inforTachThua).addClass("headerHide");
            $(TachThua.SELECTORS.inforTachThua).removeClass("headerShow");
        }
    },
    addRemoveInforTachThua: function (id) {
        let check = TachThua.GLOBAL.listInforUpdateTachThua.find(x => x.id.toString() === id.toString());
        let area = TachThua.getAreaPolygonTachThua(id);
        if (typeof check !== "undefined" && check !== null && check.soThuTuThua > 0) {
            $(TachThua.SELECTORS.SoToUpdate).val(check.soHieuToBanDo);
            $(TachThua.SELECTORS.SoThuaUpdate).val(check.soThuTuThua);
            $(TachThua.SELECTORS.SoToUpdateOld).val(check.soHieuToBanDoCu);
            $(TachThua.SELECTORS.SoThuaUpdateOld).val(check.soThuTuThuaCu);
            $(TachThua.SELECTORS.DienTichUpdate).val(area);
            $(TachThua.SELECTORS.DienTichPhapLyUpdate).val(check.dienTichPhapLy);
            $(TachThua.SELECTORS.TenChuUpdate).val(check.tenChu);
            $(TachThua.SELECTORS.DiaChiUpdate).val(check.diaChi);
            $(TachThua.SELECTORS.KHList).val(check.kyHieuMucDichSuDung);
        } else {
            let propertie = TachThua.GLOBAL.ThuaDat.features[0].properties;
            $(TachThua.SELECTORS.SoToUpdate).val(propertie.SoHieuToBanDo);
            $(TachThua.SELECTORS.SoThuaUpdate).val(0);
            $(TachThua.SELECTORS.SoToUpdateOld).val(propertie.SoHieuToBanDo);
            $(TachThua.SELECTORS.SoThuaUpdateOld).val(propertie.SoThuTuThua);
            $(TachThua.SELECTORS.DienTichUpdate).val(area);
            $(TachThua.SELECTORS.DienTichPhapLyUpdate).val(0);
            $(TachThua.SELECTORS.TenChuUpdate).val(propertie.TenChu);
            $(TachThua.SELECTORS.DiaChiUpdate).val(propertie.DiaChi);
            $(TachThua.SELECTORS.KHList).val(propertie.KyHieuMucDichSuDung);
        }
    },
    setInforUpdateTachThua: function (id, maxa) {
        let check;
        check = TachThua.GLOBAL.listInforUpdateTachThua.find(x => x.id.toString() === id.toString());
        if (TachThua.GLOBAL.listInforUpdateTachThua.length > 0 && typeof check !== "undefined" && check !== null) {
            check.soHieuToBanDo = Number($(TachThua.SELECTORS.SoToUpdate).val());
            check.soThuTuThua = Number($(TachThua.SELECTORS.SoThuaUpdate).val());
            check.soHieuToBanDoCu = Number($(TachThua.SELECTORS.SoToUpdateOld).val());
            check.soThuTuThuaCu = Number($(TachThua.SELECTORS.SoThuaUpdateOld).val());
            check.dienTich = Number($(TachThua.SELECTORS.DienTichUpdate).val());
            check.dienTichPhapLy = Number($(TachThua.SELECTORS.DienTichPhapLyUpdate).val());
            check.kyHieuMucDichSuDung = $(TachThua.SELECTORS.KHList).val();
            check.tenChu = $(TachThua.SELECTORS.TenChuUpdate).val();
            check.diaChi = $(TachThua.SELECTORS.DiaChiUpdate).val();
            check.geometry = TachThua.getGeometryById(id);
            swal({
                title: "Thông báo",
                text: "Cập nhật thông tin thành công!",
                icon: "success",
                button: "Đóng",
            });
        } else {
            check = {
                id: id,
                objectId: 0,
                uuid: id,
                thoiDiemBatDau: null,
                thoiDiemKetThuc: null,
                maXa: maxa,
                maDoiTuong: "",
                soHieuToBanDo: Number($(TachThua.SELECTORS.SoToUpdate).val()),
                soThuTuThua: Number($(TachThua.SELECTORS.SoThuaUpdate).val()),
                soHieuToBanDoCu: Number($(TachThua.SELECTORS.SoToUpdateOld).val()),
                soThuTuThuaCu: Number($(TachThua.SELECTORS.SoThuaUpdateOld).val()),
                dienTich: Number($(TachThua.SELECTORS.DienTichUpdate).val()),
                dienTichPhapLy: Number($(TachThua.SELECTORS.DienTichPhapLyUpdate).val()),
                kyHieuMucDichSuDung: $(TachThua.SELECTORS.KHList).val(),
                kyHieuDoiTuong: "",
                tenChu: $(TachThua.SELECTORS.TenChuUpdate).val(),
                diaChi: $(TachThua.SELECTORS.DiaChiUpdate).val(),
                daCapGCN: 0,
                tenChu2: "",
                namSinhC1: "",
                soHieuGCN: "",
                soVaoSo: "",
                ngayVaoSo: "",
                soBienNhan: 0,
                nguoiNhanHS: "",
                coQuanThuLy: "",
                loaiHS: "",
                maLienKet: "",
                shapeSTArea: 0,
                shapeSTLength: 0,
                shapeLength: 0,
                shapeArea: 0,
                geometry: TachThua.getGeometryById(id),
                tags: {}
            };
            TachThua.GLOBAL.listInforUpdateTachThua.push(check);
            swal({
                title: "Thông báo",
                text: "Cập nhật thông tin thành công!",
                icon: "success",
                button: "Đóng",
            });
        }
    },
    getGeometryById: function (id) {
        let list = TachThua.GLOBAL.listPolygonTachThua;
        let geometry;
        for (var i = 0; i < list.length; i++) {
            let listfeature = list[i].features;
            if ((typeof listfeature[0].properties.id !== "undefined" && listfeature[0].properties.id.toString() === id) ||
                (typeof listfeature[1].properties.id !== "undefined" && listfeature[1].properties.id.toString() === id)) {
                geometry = listfeature[0].properties.info === "vn2000" ? listfeature[0].geometry : listfeature[1].geometry;
                break;
            }
        }
        return geometry;
    },
    checkFormInfor: function () {
        let check = true;
        let SoThua = $(TachThua.SELECTORS.SoThuaUpdate).val();
        if (!validateText(SoThua, "number", 0, 0) || SoThua === "0") { insertError($(TachThua.SELECTORS.SoThuaUpdate), "other"); check = false; }
        let SoTo = $(TachThua.SELECTORS.SoToUpdate).val();
        if (!validateText(SoTo, "number", 0, 0) || SoTo === "0") { insertError($(TachThua.SELECTORS.SoToUpdate), "other"); check = false; }
        let DienTichUpdate = $(TachThua.SELECTORS.DienTichUpdate).val();
        if (!validateText(DienTichUpdate, "float", 0, 0) || DienTichUpdate === "0") { insertError($(TachThua.SELECTORS.DienTichUpdate), "other"); check = false; }
        let DienTichPhapLyUpdate = $(TachThua.SELECTORS.DienTichPhapLyUpdate).val();
        if (!validateText(DienTichPhapLyUpdate, "float", 0, 0) || DienTichPhapLyUpdate === "0") { insertError($(TachThua.SELECTORS.DienTichPhapLyUpdate), "other"); check = false; }
        let TenChuUpdate = $(TachThua.SELECTORS.TenChuUpdate).val();
        if (!validateText(TenChuUpdate, "text", 0, 0)) { insertError($(TachThua.SELECTORS.TenChuUpdate), "other"); check = false; }
        return check;
    },
    saveInforTachThua: function (data) {
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/tach-thua?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    swal({
                        title: "Thông báo",
                        text: "Cập nhật thông tin thửa đất thành công!",
                        icon: "success",
                        button: "Đóng",
                    }).then((value) => {
                        //UpdateThuaDat.updateThuaDat(parseInt(tobando), parseInt(thua));
                        //$(UpdateThuaDat.SELECTORS.modalUpdate).modal('hide');
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    getAreaPolygonTachThua: function (id) {
        let list = TachThua.GLOBAL.listPolygonTachThua;
        let obj;
        for (var i = 0; i < list.length; i++) {
            obj = (typeof list[i].features[0].properties.id !== "undefined" && list[i].features[0].properties.id == id) ? list[i] : ((typeof list[i].features[1].properties.id !== "undefined" && list[i].features[1].properties.id == id) ? list[i]:null);
            if (typeof obj !== "undefined" && obj !== null) {
                obj = (obj.features[0].properties.info === "vn2000") ? obj.features[0] : obj.features[1];
                break;
            }
        }
        if (typeof obj !== "undefined" && obj !== null) {
            if (obj.geometry.type.toLowerCase() === "polygon") {
                let point = {
                    points: obj.geometry.coordinates[0]
                }
                return Math.abs(TachThua.calculateAreaPolygonVN2000(point));
            }
            if (obj.geometry.type.toLowerCase() === "MultiPolygon") {
                let point = {
                    points: obj.geometry.coordinates[0][0]
                }
                return Math.abs(TachThua.calculateAreaPolygonVN2000(point));
            }
        }
    },
    calculateAreaPolygonVN2000: function (data) {
        let res = 0;
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/calculate?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    res = Math.round(data.result.area.value * 100) / 100;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
        return res;
    },
    sortPointResult: function () {
        TachThua.GLOBAL.listSortKetQuaGhiNhan = [];
        $(TachThua.SELECTORS.pointGhiNhanChild).each(function () {
            let id = $(this).find("th").attr("data-id");
            if (typeof id !== "undefined" && id !== null) {
                TachThua.GLOBAL.listSortKetQuaGhiNhan.push(Number(id));
            }
        })
        if (TachThua.GLOBAL.listSortKetQuaGhiNhan.length > 1) {
            TachThua.drawPolylineDiem(TachThua.GLOBAL.listSortKetQuaGhiNhan);
        }
    },
    drawPolylineDiem: function (listSort) {
        if (TachThua.GLOBAL.polylineGhiNhan !== null) {
            TachThua.GLOBAL.polylineGhiNhan.setMap(null);
            TachThua.GLOBAL.polylineGhiNhan=null;
        }
        let path = [];
        $.each(listSort, function (i,obj) {
            let point = TachThua.GLOBAL.listKetQuaGhiNhan[obj].diem84;
            path.push(point)
        });
        TachThua.GLOBAL.polylineGhiNhan = new map4d.Polyline({
            path: path,
            visible: true,
            strokeColor: "#3dab21",
            strokeWidth: 2,
            strokeOpacity: 1,
            closed: false
        });
        TachThua.GLOBAL.polylineGhiNhan.setMap(maptachthua);
    },
    removeDrawPolylineDiem: function () {
        if (TachThua.GLOBAL.polylineGhiNhan !== null) {
            TachThua.GLOBAL.polylineGhiNhan.setMap(null);
            TachThua.GLOBAL.polylineGhiNhan = null;
        }
    }
}