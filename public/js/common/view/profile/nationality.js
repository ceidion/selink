define([
    'common/view/item-base',
    'text!common/template/profile/nationality.html'
], function(
    BaseView,
    template) {

    var countryList = {
        "アジア": ["アゼルバイジャン","アフガニスタン","アブハジア","アラブ首長国連邦","アルメニア","イエメン","イスラエル）","イラク","イラン","インド","インドネシア","ウズベキスタン","オマーン","カザフスタン","カタール","カンボジア","北キプロス・トルコ共和国","キプロス","キルギス","クウェート","グルジア","サウジアラビア","シリア","シンガポール","スリランカ","タイ","韓国","タジキスタン","中華人民共和国","北朝鮮","トルクメニスタン","ナゴルノ・カラバフ","日本","ネパール","バーレーン","パキスタン","パレスチナ","バングラデシュ","東ティモール","フィリピン","ブータン","ブルネイ","ベトナム","マレーシア","南オセチア","ミャンマー","モルディブ","モンゴル","ヨルダン","ラオス","レバノン",],
        "アフリカ": ["アルジェリア","アンゴラ","ウガンダ","エジプト","エチオピア","エリトリア","ガーナ","カーボベルデ","ガボン","カメルーン","ガンビア","ギニア","ギニアビサウ","ケニア","コートジボワール","コモロ","コンゴ共和国","コンゴ民主共和国","サントメ・プリンシペ","ザンビア","シエラレオネ","ジブチ","ジンバブエ","スーダン","スワジランド","セーシェル","赤道ギニア","セネガル","ソマリア","ソマリランド","タンザニア","チャド","中央アフリカ","チュニジア","トーゴ","ナイジェリア","ナミビア","ニジェール","西サハラ","ブルキナファソ","ブルンジ","ベナン","ボツワナ","マダガスカル","マラウイ","マリ","南アフリカ共和国","南スーダン","モーリシャス","モーリタニア","モザンビーク","モロッコ","リビア","リベリア","ルワンダ","レソト",],
        "ヨーロッパ": ["アイスランド","アイルランド","アルバニア","アンドラ","イギリス","イタリア","ウクライナ","エストニア","沿ドニエストル","オーストリア","オランダ","ギリシャ","クロアチア","コソボ","サンマリノ","スイス","スウェーデン","スペイン","スロバキア","スロベニア","セルビア","チェコ","デンマーク","ドイツ","トルコ","ノルウェー","バチカン","ハンガリー","フィンランド","フランス","ブルガリア","ベラルーシ","ベルギー","ポーランド","ボスニア・ヘルツェゴビナ","ポルトガル","マケドニア","マルタ","モナコ","モルドバ","モンテネグロ","ラトビア","リトアニア","リヒテンシュタイン","ルーマニア","ルクセンブルク","ロシア",],
        "北アメリカ": ["アメリカ合衆国","アンティグア・バーブーダ","エルサルバドル","カナダ","キューバ","グアテマラ","グレナダ","コスタリカ","ジャマイカ","セントクリストファー・ネイビス","セントビンセント・グレナディーン","セントルシア","ドミニカ共和国","ドミニカ国","トリニダード・トバゴ","ニカラグア","ハイチ","パナマ","バハマ","バルバドス","ベリーズ","ホンジュラス","メキシコ",],
        "南アメリカ": ["アルゼンチン","ウルグアイ","エクアドル","ガイアナ","コロンビア","スリナム","チリ","パラグアイ","ブラジル","ベネズエラ","ペルー","ボリビア",],
        "オセアニア": ["オーストラリア","キリバス","クック諸島","サモア","ソロモン諸島","ツバル","トンガ","ナウル","ニウエ","ニュージーランド","バヌアツ","パプアニューギニア","パラオ","フィジー","マーシャル諸島","ミクロネシア連邦",],
    };

    return BaseView.extend({

        // template
        template: template,

        // className
        className: 'row form-group',

        // initializer
        initialize: function() {

            // this model attribute is for display, set it silently
            this.model.set('countryList', countryList, {silent: true});

            this.ui = _.extend({}, this.ui, {
                'input': 'select'
            });

            this.events = _.extend({}, this.events, {
                'change select': 'save'
            });
        },

        // after render
        onRender: function() {

            // enable chosen
            this.$el.find('select').chosen({
                width: "95%",
                no_results_text: "該当国名は存在しません"
            });
        },

        // get user input data
        getData: function() {
            return {
                nationality: this.ui.input.val()
            };
        },

        // render value by user input data
        renderValue: function(data) {
            this.ui.value.text(data.nationality);
        }

    });
});