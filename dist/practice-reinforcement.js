// Authored follow-up exercises. `focus` links each item to a specific existing
// lesson/goal; IDs and the original ten-question courses remain unchanged.
const blank=(focus,ko,cue,answer,full,note,extra={})=>({focus,kind:'input',ko,cue,answer,full,hint:note,note,...extra});
const write=(focus,ko,full,note,extra={})=>{
  const split=ko.indexOf(': ');
  return {focus,kind:'input',...(split<0?{ko}:{context:ko.slice(0,split),ko:ko.slice(split+2)}),answer:full,full,hint:note,note,...extra};
};
const arrange=(focus,ko,full,note,extra={})=>({...write(focus,ko,full,note,extra),kind:'order',tiles:full.replace(/[.,!?]/g,'').split(' ')});

export const reinforcementSpecs = {
  want: [
    blank(1,'물을 마시고 싶어.','Je ___ boire de l’eau.','veux','Je veux boire de l’eau.','원하는 행동은 veux 뒤에 동사원형으로 붙여요.',{glossary:'boire de l’eau = 물을 마시다'}),
    blank(5,'계속하고 싶지 않아.','Je ne veux ___ continuer.','pas','Je ne veux pas continuer.','부정 표현 ne … pas가 veux를 감싸요.'),
    arrange(1,'여기서 먹고 싶어.','Je veux manger ici.','원하는 행동 manger 뒤에 장소 ici를 붙여요.'),
    write(1,'지금 자고 싶어.','Je veux dormir maintenant.','원하는 행동은 dormir, “지금”은 maintenant이에요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je veux dormir.','Je veux maintenant dormir.']}),
    write(5,'여기에 있고 싶지 않아.','Je ne veux pas rester ici.','veux를 ne … pas로 감싸고 rester ici를 붙여요.'),
    write(1,'밖에 나가기 전에 말해요: 지금 먹고 싶어.','Je veux manger maintenant.','Je veux 뒤의 행동은 manger예요. 지금이라는 시간도 넣어요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je veux manger.','Je veux maintenant manger.']}),
    write(5,'친구가 출발하자고 해요: 지금 떠나고 싶지 않아.','Je ne veux pas partir maintenant.','원하지 않는 행동 partir 앞에 ne veux pas를 써요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je ne veux pas partir.','Je ne veux pas maintenant partir.']}),
    write(1,'갈증이 나요: 물을 마시고 싶어.','Je veux boire de l’eau.','boire는 동사원형이에요. boire de l’eau를 veux 뒤에 붙여요.'),
    write(1,'연습을 잠깐 쉬었어요: 지금 계속하고 싶어.','Je veux continuer maintenant.','배운 continuer를 veux 뒤에 붙이고 시간을 덧붙여요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je veux continuer.','Je veux maintenant continuer.']}),
    write(5,'식사 제안을 받았어요: 지금 먹고 싶지 않아.','Je ne veux pas manger maintenant.','Je ne veux pas 뒤에는 manger를 원형 그대로 써요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je ne veux pas manger.','Je ne veux pas maintenant manger.']})
  ],
  can: [
    blank(1,'여기에 머무를 수 있어.','Je ___ rester ici.','peux','Je peux rester ici.','가능한 행동 rester를 peux 뒤에 붙여요.',{glossary:'rester ici = 여기에 머무르다'}),
    blank(5,'다시 시작할 수 없어.','Je ne peux ___ recommencer.','pas','Je ne peux pas recommencer.','ne … pas로 peux를 감싸서 불가능함을 말해요.'),
    arrange(1,'지금 해볼 수 있어.','Je peux essayer maintenant.','peux 뒤에 essayer, 그다음 시간을 붙여요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je peux essayer.','Je peux maintenant essayer.']}),
    write(1,'여기서 기다릴 수 있어.','Je peux attendre ici.','기다리는 행동 attendre 뒤에 장소 ici를 붙여요.',{glossary:'ici = 여기'}),
    write(5,'지금 말할 수 없어.','Je ne peux pas parler maintenant.','할 수 없는 행동은 ne peux pas 뒤에 원형으로 써요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je ne peux pas parler.','Je ne peux pas maintenant parler.']}),
    write(1,'친구가 와 달라고 해요: 지금 올 수 있어.','Je peux venir maintenant.','venir는 상대가 있는 곳으로 오는 행동이에요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je peux venir.','Je peux maintenant venir.']}),
    write(5,'문이 곧 닫혀요: 여기서 기다릴 수 없어.','Je ne peux pas attendre ici.','부정 표현은 peux를 감싸고, 장소는 attendre 뒤에 붙여요.'),
    write(1,'연습을 다시 할 시간이 있어요: 지금 다시 시작할 수 있어.','Je peux recommencer maintenant.','peux 뒤에는 recommencer를 원형으로 써요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je peux recommencer.','Je peux maintenant recommencer.']}),
    write(5,'다른 약속이 있어요: 여기에 머무를 수 없어.','Je ne peux pas rester ici.','rester ici의 뜻은 그대로 두고 peux를 부정해요.'),
    write(1,'조용한 장소를 찾았어요: 여기서 말할 수 있어.','Je peux parler ici.','할 수 있는 행동 parler와 장소 ici를 함께 말해요.')
  ],
  like: [
    blank(1,'집에서 읽는 걸 좋아해.','J’___ lire à la maison.','aime','J’aime lire à la maison.','aime 뒤에 읽는 활동과 장소를 붙여요.',{glossary:'à la maison = 집에서'}),
    blank(5,'그림 그리는 걸 좋아하지 않아.','Je n’aime ___ dessiner.','pas','Je n’aime pas dessiner.','n’ … pas가 aime를 감싸요.'),
    arrange(4,'읽는 걸 아주 좋아해.','J’aime beaucoup lire.','beaucoup를 aime 뒤에 놓아 좋아하는 정도를 말해요.'),
    write(1,'집에서 요리하는 걸 좋아해.','J’aime cuisiner à la maison.','cuisiner 뒤에 장소 à la maison을 덧붙여요.',{glossary:'à la maison = 집에서',accepted:['J’aime bien cuisiner à la maison.','À la maison, j’aime cuisiner.']}),
    write(4,'그림 그리는 걸 아주 좋아해.','J’aime beaucoup dessiner.','배운 dessiner를 aime beaucoup 뒤에 붙여요.'),
    write(1,'조용한 시간을 보내요: 여기서 읽는 걸 좋아해.','J’aime lire ici.','좋아하는 활동 lire와 장소 ici를 함께 말해요.',{glossary:'ici = 여기',accepted:['J’aime bien lire ici.','Ici, j’aime lire.']}),
    write(5,'주방이 불편해요: 여기서 요리하는 걸 좋아하지 않아.','Je n’aime pas cuisiner ici.','활동 cuisiner 앞에 n’aime pas를 놓아요.',{glossary:'ici = 여기',accepted:['Ici, je n’aime pas cuisiner.']}),
    write(4,'취미를 이야기해요: 요리하는 걸 아주 좋아해.','J’aime beaucoup cuisiner.','좋아하는 정도 beaucoup는 aime 뒤에 놓아요.'),
    write(1,'산책길을 찾았어요: 여기서 걷는 걸 좋아해.','J’aime marcher ici.','marcher는 aime 뒤에서 원형을 유지해요.',{glossary:'ici = 여기',accepted:['J’aime bien marcher ici.','Ici, j’aime marcher.']}),
    write(5,'기다리는 장소가 불편해요: 여기서 기다리는 걸 좋아하지 않아.','Je n’aime pas attendre ici.','n’aime pas 뒤에 기다리는 활동 attendre를 써요.',{glossary:'ici = 여기',accepted:['Ici, je n’aime pas attendre.']})
  ],
  be: [
    blank(1,'나는 카페에 있어.','Je ___ au café.','suis','Je suis au café.','je와 쓰는 être의 현재형은 suis예요.',{glossary:'au café = 카페에'}),
    blank(5,'나는 집에 없어.','Je ne suis ___ à la maison.','pas','Je ne suis pas à la maison.','ne … pas가 suis를 감싸요.'),
    arrange(1,'나는 지금 집에 있어.','Je suis à la maison maintenant.','suis 뒤에 장소와 시간을 붙여요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je suis à la maison.','Je suis maintenant à la maison.']}),
    write(8,'나는 준비되지 않았어.','Je ne suis pas prêt.','상태를 부정할 때도 ne … pas가 suis를 감싸요.',{accepted:['Je ne suis pas prête.']}),
    write(10,'나는 피곤하지 않아.','Je ne suis pas fatigué.','피곤한 상태를 부정해요. 화자에 따라 fatiguée도 써요.',{accepted:['Je ne suis pas fatiguée.']}),
    write(1,'친구에게 위치를 알려요: 나는 카페에 있어.','Je suis au café.','être로 위치를 말해요. “카페에”는 au café예요.'),
    write(5,'친구가 카페에서 찾아요: 나는 카페에 없어.','Je ne suis pas au café.','카페라는 장소는 유지하고 suis를 부정해요.'),
    write(8,'출발 전에 말해요: 나는 지금 준비됐어.','Je suis prêt maintenant.','prêt 또는 prête로 준비된 상태를 말해요.',{glossary:'maintenant = 지금',accepted:['Je suis prête maintenant.','Maintenant, je suis prêt.','Maintenant, je suis prête.','Je suis maintenant prêt.','Je suis maintenant prête.']}),
    write(10,'하루를 마치고 말해요: 나는 지금 피곤해.','Je suis fatigué maintenant.','상태 형용사는 화자에 따라 fatigué 또는 fatiguée예요.',{glossary:'maintenant = 지금',accepted:['Je suis fatiguée maintenant.','Maintenant, je suis fatigué.','Maintenant, je suis fatiguée.','Je suis maintenant fatigué.','Je suis maintenant fatiguée.']}),
    write(5,'친구에게 위치를 정정해요: 나는 지금 집에 없어.','Je ne suis pas à la maison maintenant.','위치 à la maison 앞에서 suis를 부정해요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je ne suis pas à la maison.','Je ne suis pas maintenant à la maison.']})
  ],
  have: [
    blank(1,'나는 책 두 권이 있어.','J’___ deux livres.','ai','J’ai deux livres.','je와 쓰는 avoir는 ai예요. 수량 뒤에는 복수 명사를 써요.',{glossary:'deux livres = 책 두 권'}),
    blank(5,'나는 가방이 없어.','Je n’ai pas ___ sac.','de','Je n’ai pas de sac.','소유를 부정하는 pas 뒤에서 un sac은 de sac이 돼요.'),
    arrange(1,'나는 책 한 권과 가방 하나가 있어.','J’ai un livre et un sac.','두 소유물을 et로 연결해요.',{glossary:'et = 그리고',accepted:['J’ai un sac et un livre.']}),
    write(5,'나는 책이 없어.','Je n’ai pas de livre.','부정문에서는 un livre를 de livre로 바꿔요.',{accepted:['Je n’ai pas de livres.']}),
    write(8,'나는 배고프지 않아.','Je n’ai pas faim.','몸 상태 faim은 avoir와 쓰고, ne … pas가 ai를 감싸요.'),
    write(1,'가방 안의 물건을 말해요: 나는 책 두 권이 있어.','J’ai deux livres.','수량 deux 뒤에 livres의 복수형 s를 써요.'),
    write(10,'물을 마셨어요: 나는 목마르지 않아.','Je n’ai pas soif.','목마름은 avoir soif예요. être로 바꾸지 않아요.'),
    write(1,'짐을 확인해요: 나는 가방 두 개가 있어.','J’ai deux sacs.','배운 deux 뒤에서 sac에도 복수형 s를 붙여요.'),
    write(8,'점심때 말해요: 나는 지금 배고파.','J’ai faim maintenant.','avoir faim으로 배고픔을 말하고 시간을 덧붙여요.',{glossary:'maintenant = 지금',accepted:['Maintenant, j’ai faim.','J’ai maintenant faim.']}),
    write(10,'산책 후 말해요: 나는 지금 목말라.','J’ai soif maintenant.','avoir soif로 몸 상태를 말해요.',{glossary:'maintenant = 지금',accepted:['Maintenant, j’ai soif.','J’ai maintenant soif.']})
  ],
  go: [
    blank(1,'나는 식당에 가.','Je ___ au restaurant.','vais','Je vais au restaurant.','je와 쓰는 aller는 vais예요.',{glossary:'au restaurant = 식당에'}),
    blank(5,'나는 역에 가.','Je vais ___ gare.','à la','Je vais à la gare.','여성 명사 gare 앞에서는 à la를 써요.',{glossary:'la gare = 역'}),
    arrange(1,'나는 지금 집에 가.','Je vais à la maison maintenant.','목적지 à la maison 뒤에 시간을 덧붙여요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je vais à la maison.','Je vais maintenant à la maison.']}),
    write(5,'나는 식당에 가.','Je vais au restaurant.','à와 le가 합쳐져 au가 돼요.'),
    write(8,'나는 역에 가지 않아.','Je ne vais pas à la gare.','ne … pas가 vais를 감싸요. à la gare는 유지해요.'),
    write(5,'길을 설명해요: 나는 역에 가.','Je vais à la gare.','aller로 목적지를 말하고 gare 앞에 à la를 써요.'),
    write(8,'외식하지 않아요: 나는 식당에 가지 않아.','Je ne vais pas au restaurant.','식당이라는 목적지는 au restaurant으로 유지해요.'),
    write(5,'출발하면서 말해요: 나는 지금 카페에 가.','Je vais au café maintenant.','café 앞에서는 à le 대신 au를 써요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je vais au café.','Je vais maintenant au café.']}),
    write(5,'숙소로 향해요: 나는 호텔에 가.','Je vais à l’hôtel.','모음 소리로 시작하는 hôtel 앞에서 le는 l’가 돼요.',{glossary:'l’hôtel = 호텔'}),
    write(8,'아직 외출 중이에요: 나는 지금 집에 가지 않아.','Je ne vais pas à la maison maintenant.','vais를 부정하고 집이라는 목적지와 시간을 붙여요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je ne vais pas à la maison.','Je ne vais pas maintenant à la maison.']})
  ],
  'order-food': [
    blank(1,'커피 두 잔 주세요.','Je ___ deux cafés.','voudrais','Je voudrais deux cafés.','정중한 주문은 Je voudrais로 시작해요.',{glossary:'deux cafés = 커피 두 잔'}),
    blank(4,'샐러드 하나 주세요.','Je voudrais ___ salade.','une','Je voudrais une salade.','salade는 여성 명사이므로 une를 써요.'),
    arrange(1,'차 한 잔과 크루아상 하나 주세요.','Je voudrais un thé et un croissant.','두 주문을 et로 연결해요.',{glossary:'et = 그리고',accepted:['Je voudrais un croissant et un thé.']}),
    write(1,'크루아상 두 개 주세요.','Je voudrais deux croissants.','수량 deux 뒤에 croissants의 복수형 s를 써요.',{glossary:'deux = 둘'}),
    write(1,'샌드위치 하나와 커피 한 잔 주세요.','Je voudrais un sandwich et un café.','각 남성 단수 명사 앞에 un을 붙여요.',{accepted:['Je voudrais un café et un sandwich.']}),
    write(1,'친구와 함께 카페에서 주문해요: 커피 두 잔 주세요.','Je voudrais deux cafés.','정중한 표현 voudrais 뒤에 수량과 음료를 붙여요.'),
    write(1,'빵집에서 주문해요: 크루아상 세 개 주세요.','Je voudrais trois croissants.','수량 trois 뒤에는 복수 croissants를 써요.',{glossary:'trois = 셋'}),
    write(1,'식당에서 주문해요: 샐러드 두 개 주세요.','Je voudrais deux salades.','une 대신 수량 deux를 쓰고 salades에 s를 붙여요.'),
    write(1,'친구 몫도 주문해요: 차 두 잔 주세요.','Je voudrais deux thés.','음료의 수량을 말할 때 thés처럼 복수형을 써요.'),
    write(1,'점심을 주문해요: 샌드위치 하나와 샐러드 하나 주세요.','Je voudrais un sandwich et une salade.','sandwich는 un, salade는 une로 구분하고 et로 연결해요.',{accepted:['Je voudrais une salade et un sandwich.']})
  ],
  need: [
    blank(1,'나는 물이 필요해.','J’ai ___ d’eau.','besoin','J’ai besoin d’eau.','필요한 것은 avoir besoin de 뒤에 붙여요.',{glossary:'de l’eau = 물'}),
    blank(5,'나는 잠을 잘 필요가 없어.','Je n’ai ___ besoin de dormir.','pas','Je n’ai pas besoin de dormir.','ne … pas는 ai를 감싸고 besoin de는 유지해요.'),
    arrange(8,'나는 여기에 머무를 필요가 있어.','J’ai besoin de rester ici.','besoin de 뒤에 행동 rester ici를 붙여요.',{glossary:'rester ici = 여기에 머무르다'}),
    write(1,'나는 물이 필요해.','J’ai besoin d’eau.','de는 모음으로 시작하는 eau 앞에서 d’가 돼요.'),
    write(5,'나는 먹을 필요가 없어.','Je n’ai pas besoin de manger.','ne … pas로 필요를 부정해요. de manger는 그대로예요.'),
    write(1,'길을 잃었어요: 나는 지금 도움이 필요해.','J’ai besoin d’aide maintenant.','도움이라는 명사 aide 앞에서 de가 d’로 줄어요.',{glossary:'maintenant = 지금',accepted:['Maintenant, j’ai besoin d’aide.','J’ai maintenant besoin d’aide.']}),
    write(8,'목이 말라요: 나는 마실 필요가 있어.','J’ai besoin de boire.','명사 대신 동사원형 boire를 de 뒤에 붙여요.',{glossary:'boire = 마시다'}),
    write(5,'일을 끝냈어요: 나는 지금 도움이 필요하지 않아.','Je n’ai pas besoin d’aide maintenant.','필요를 부정할 때도 d’aide는 유지해요.',{glossary:'maintenant = 지금',accepted:['Maintenant, je n’ai pas besoin d’aide.','Je n’ai pas maintenant besoin d’aide.']}),
    write(8,'잠시 기다려야 해요: 나는 여기에 머무를 필요가 있어.','J’ai besoin de rester ici.','필요한 행동 rester ici를 besoin de 뒤에 넣어요.'),
    write(1,'피곤한 날이에요: 나는 지금 휴식이 필요해.','J’ai besoin de repos maintenant.','필요한 것이 명사 repos일 때도 besoin de를 써요.',{glossary:'maintenant = 지금',accepted:['Maintenant, j’ai besoin de repos.','J’ai maintenant besoin de repos.','J’ai besoin de me reposer maintenant.','Maintenant, j’ai besoin de me reposer.']})
  ],
  where: [
    blank(1,'식당은 어디에 있어?','Où ___ le restaurant ?','est','Où est le restaurant ?','장소 하나를 물으면 être의 단수형 est를 써요.',{glossary:'le restaurant = 식당'}),
    blank(5,'호텔들은 어디에 있어?','Où ___ les hôtels ?','sont','Où sont les hôtels ?','복수 les hôtels에 맞는 동사는 sont예요.',{glossary:'les hôtels = 호텔들'}),
    arrange(1,'도서관은 어디에 있어?','Où est la bibliothèque ?','단수 bibliothèque의 위치는 Où est로 물어요.',{glossary:'la bibliothèque = 도서관',accepted:['La bibliothèque est où ?','Où se trouve la bibliothèque ?']}),
    write(1,'식당은 어디에 있어?','Où est le restaurant ?','restaurant은 단수이므로 est를 써요.',{accepted:['Le restaurant est où ?','Où se trouve le restaurant ?']}),
    write(5,'호텔들은 어디에 있어?','Où sont les hôtels ?','장소가 여럿이면 sont와 복수 명사를 써요.',{accepted:['Les hôtels sont où ?','Où se trouvent les hôtels ?']}),
    write(1,'책을 읽을 곳을 찾아요: 도서관은 어디에 있어?','Où est la bibliothèque ?','Où est 뒤에 찾는 장소 la bibliothèque를 붙여요.',{accepted:['La bibliothèque est où ?','Où se trouve la bibliothèque ?']}),
    write(5,'지도에서 여러 곳을 찾아요: 식당들은 어디에 있어?','Où sont les restaurants ?','est를 sont로 바꾸고 restaurants에도 s를 써요.',{accepted:['Les restaurants sont où ?','Où se trouvent les restaurants ?']}),
    write(1,'공항에 가려고 해요: 공항은 어디에 있어?','Où est l’aéroport ?','aéroport 앞에서는 le를 l’로 줄여요.',{glossary:'l’aéroport = 공항',accepted:['L’aéroport est où ?','Où se trouve l’aéroport ?']}),
    write(5,'여행 안내소에서 물어요: 박물관들은 어디에 있어?','Où sont les musées ?','musée에 복수형 s를 붙이고 sont와 연결해요.',{accepted:['Les musées sont où ?','Où se trouvent les musées ?']}),
    write(5,'시내 지도를 보고 물어요: 카페들은 어디에 있어?','Où sont les cafés ?','복수 장소 les cafés의 위치를 sont로 물어요.',{accepted:['Les cafés sont où ?','Où se trouvent les cafés ?']})
  ],
  'past-events': [
    blank(1,'우리는 어제 일했어.','Nous ___ travaillé hier.','avons','Nous avons travaillé hier.','nous에 맞는 avoir는 avons예요. travaillé는 그대로예요.'),
    blank(2,'너는 영화를 봤어. (regarder)','Tu as ___ un film.','regardé','Tu as regardé un film.','regarder의 -er를 -é로 바꿔 과거분사를 만들어요.'),
    arrange(5,'나는 어제 일하지 않았어.','Je n’ai pas travaillé hier.','ne … pas가 조동사 ai를 감싸요.',{accepted:['Hier, je n’ai pas travaillé.']}),
    write(4,'우리는 우리 일을 끝냈어.','Nous avons fini notre travail.','nous avons 뒤에 과거분사 fini를 써요.',{glossary:'notre travail = 우리 일'}),
    write(6,'우리는 아직 먹지 않았어.','Nous n’avons pas encore mangé.','nous의 조동사 avons를 부정하고 encore를 mangé 앞에 둬요.'),
    write(7,'영화 이야기를 해요: 그녀는 이 영화를 봤어. (voir)','Elle a vu ce film.','elle의 조동사 a 뒤에 voir의 과거분사 vu를 써요.'),
    write(5,'친구의 말을 정정해요: 우리는 이 영화를 보지 않았어. (voir)','Nous n’avons pas vu ce film.','부정은 avons를 감싸요. vu는 변하지 않아요.'),
    write(10,'어제 식사한 곳을 말해요: 나는 어제 집에서 먹었어.','J’ai mangé à la maison hier.','manger의 과거분사 mangé 뒤에 장소와 시간을 붙여요.',{glossary:'à la maison = 집에서',accepted:['Hier, j’ai mangé à la maison.','J’ai mangé hier à la maison.']}),
    write(4,'업무 진행을 알려요: 그녀는 자기 일을 끝냈어.','Elle a fini son travail.','그녀의 조동사는 a예요. son travail은 여기서 그녀의 일이에요.',{glossary:'son travail = 자기 일'}),
    write(2,'어제 저녁을 이야기해요: 우리는 어제 영화를 봤어. (regarder)','Nous avons regardé un film hier.','주어 nous에 맞춘 avons 뒤에 regardé를 붙여요.',{accepted:['Hier, nous avons regardé un film.','Nous avons regardé hier un film.']})
  ],
  'past-movement': [
    blank(1,'그 여자들은 파리에 갔어.','Elles sont ___ à Paris.','allées','Elles sont allées à Paris.','여성 복수 elles에 맞게 allé에 -es를 붙여요.'),
    blank(4,'그는 어제 도착했어.','Il ___ arrivé hier.','est','Il est arrivé hier.','arriver의 이 용법에서는 être의 현재형 est를 써요.'),
    arrange(5,'그녀는 떠나지 않았어.','Elle n’est pas partie.','부정은 est를 감싸고 partie의 여성형 e는 유지해요.'),
    write(4,'그 여자들은 어제 도착했어.','Elles sont arrivées hier.','arrivées는 여성 복수 elles와 일치해요.',{accepted:['Hier, elles sont arrivées.']}),
    write(5,'그 남자들은 어젯밤 떠났어.','Ils sont partis hier soir.','남성 복수형 partis를 sont 뒤에 써요.',{glossary:'hier soir = 어젯밤',accepted:['Hier soir, ils sont partis.']}),
    write(1,'친구들의 여행을 이야기해요: 그 남자들은 파리에 갔어.','Ils sont allés à Paris.','aller의 과거분사는 남성 복수 주어에 맞춰 allés가 돼요.'),
    write(4,'도착 소식을 전해요: 그녀는 제시간에 도착했어.','Elle est arrivée à l’heure.','여성 단수 arrivée와 “제시간에” à l’heure를 연결해요.'),
    write(7,'소문을 정정해요: 그 여자들은 파리에 가지 않았어.','Elles ne sont pas allées à Paris.','부정문에서도 여성 복수형 allées를 유지해요.'),
    write(4,'내 도착 소식을 전해요: 나는 어제 도착했어.','Je suis arrivé hier.','je와 쓰는 조동사는 suis예요. 화자에 따라 arrivée도 써요.',{accepted:['Je suis arrivée hier.','Hier, je suis arrivé.','Hier, je suis arrivée.']}),
    write(5,'아직 기다리고 있어요: 그 남자들은 떠나지 않았어.','Ils ne sont pas partis.','ne … pas가 sont를 감싸고 partis는 남성 복수형이에요.')
  ],
  'past-background': [
    blank(1,'그녀는 그때 파리에 살고 있었어.','À cette époque, elle ___ à Paris.','habitait','À cette époque, elle habitait à Paris.','elle의 반과거 어미는 -ait예요.'),
    blank(2,'나는 그때 매일 일하곤 했어.','À cette époque, je ___ tous les jours.','travaillais','À cette époque, je travaillais tous les jours.','과거의 반복된 습관은 반과거 travaillais로 말해요.'),
    arrange(5,'내가 먹고 있을 때 전화가 울렸어.','Je mangeais quand le téléphone a sonné.','진행 중이던 식사는 mangeais, 발생한 사건은 a sonné예요.',{glossary:'manger = 먹다 · je mangeais = 나는 먹고 있었다',accepted:['Quand le téléphone a sonné, je mangeais.']}),
    write(1,'나는 그때 파리에 살고 있지 않았어.','À cette époque, je n’habitais pas à Paris.','반과거 habitais를 n’ … pas로 감싸요.',{accepted:['Je n’habitais pas à Paris à cette époque.']}),
    write(7,'비가 오고 있었고, 그녀는 집에 있었어.','Il pleuvait et elle était à la maison.','두 과거 배경을 pleuvait와 était로 표현해요.',{accepted:['Elle était à la maison et il pleuvait.']}),
    write(4,'어제 저녁을 떠올려요: 어제 여덟 시에 그녀는 책을 읽고 있었어.','Elle lisait un livre hier à huit heures.','lire의 elle 반과거는 lisait예요. 시점은 앞이나 뒤에 놓을 수 있어요.',{accepted:['Hier, à huit heures, elle lisait un livre.','Hier, elle lisait un livre à huit heures.','Elle lisait un livre à huit heures hier.','À huit heures hier, elle lisait un livre.']}),
    write(5,'전화가 왔던 순간이에요: 그녀가 요리하고 있을 때 전화가 울렸어.','Elle cuisinait quand le téléphone a sonné.','cuisiner의 elle 반과거는 cuisinait예요.',{accepted:['Quand le téléphone a sonné, elle cuisinait.']}),
    write(2,'예전 습관을 이야기해요: 우리는 그때 매일 읽곤 했어.','À cette époque, nous lisions tous les jours.','lire의 nous 반과거는 lisions예요.',{glossary:'lire의 반과거 어간 = lis-',accepted:['Nous lisions tous les jours à cette époque.']}),
    write(8,'그 당시 상황이에요: 우리는 그때 시간이 있었어.','À cette époque, nous avions le temps.','avoir의 nous 반과거는 avions예요.',{glossary:'avoir le temps = 시간이 있다',accepted:['Nous avions le temps à cette époque.']}),
    write(5,'전화를 받기 직전이에요: 우리가 읽고 있을 때 전화가 울렸어.','Nous lisions quand le téléphone a sonné.','진행 중인 배경은 lisions, 전화가 울린 사건은 a sonné예요.',{accepted:['Quand le téléphone a sonné, nous lisions.']})
  ],
  'future-plans': [
    blank(1,'그녀는 내일 일할 거야.','Elle ___ demain.','travaillera','Elle travaillera demain.','travailler에 elle의 단순미래 어미 -a를 붙여요.'),
    blank(2,'너는 내일 집에서 먹을 거야.','Tu ___ à la maison demain.','mangeras','Tu mangeras à la maison demain.','manger에 tu의 미래 어미 -as를 붙여요.',{glossary:'à la maison = 집에서'}),
    arrange(7,'나는 내일 일하지 않을 거야.','Je ne travaillerai pas demain.','je의 단순미래 travaillerai를 ne … pas로 감싸요.',{accepted:['Demain, je ne travaillerai pas.']}),
    write(4,'그녀는 내일 시간이 있을 거야.','Elle aura le temps demain.','avoir의 미래 어간 aur-에 -a를 붙여 aura로 써요.',{accepted:['Demain, elle aura le temps.','Elle aura demain le temps.']}),
    write(6,'나는 내일 여기에 있을 거야.','Je serai ici demain.','être의 je 단순미래는 serai예요.',{accepted:['Demain, je serai ici.','Je serai demain ici.']}),
    write(5,'함께 여행을 계획해요: 우리는 내일 파리에 갈 거야.','Nous irons à Paris demain.','aller의 미래 어간 ir-에 nous의 어미 -ons를 붙여요.',{accepted:['Demain, nous irons à Paris.','Nous irons demain à Paris.']}),
    write(8,'약속을 확인해요: 그녀는 내일 올 거야.','Elle viendra demain.','venir의 단순미래 어간은 viendr-예요.',{accepted:['Demain, elle viendra.']}),
    write(7,'일정을 바꿨어요: 우리는 내일 파리에 가지 않을 거야.','Nous n’irons pas à Paris demain.','모음 앞의 ne는 n’가 돼요. n’irons pas로 부정해요.',{accepted:['Demain, nous n’irons pas à Paris.','Nous n’irons pas demain à Paris.']}),
    write(10,'할 일을 정해요: 나는 내일 이 일을 할 거야.','Je ferai ce travail demain.','faire의 미래 어간 fer-에 -ai를 붙여요.',{accepted:['Demain, je ferai ce travail.','Je ferai demain ce travail.']}),
    write(2,'내일 식사 장소예요: 우리는 내일 집에서 먹을 거야.','Nous mangerons à la maison demain.','manger의 nous 단순미래 mangerons를 써요.',{accepted:['Demain, nous mangerons à la maison.','Nous mangerons demain à la maison.']})
  ],
  'real-conditions': [
    blank(1,'그녀에게 시간이 있으면 그녀는 올 거야.','Si elle ___ le temps, elle viendra.','a','Si elle a le temps, elle viendra.','가능한 미래 조건의 si 뒤에는 현재형 a를 써요.'),
    blank(5,'네가 오면 우리는 이야기할 거야.','Si tu viens, nous ___.','parlerons','Si tu viens, nous parlerons.','결과는 parler의 nous 단순미래 parlerons로 써요.'),
    arrange(3,'비가 오면 나는 집에 머무를 거야.','S’il pleut, je resterai à la maison.','조건은 현재형 pleut, 결과는 미래형 resterai예요.',{accepted:['Je resterai à la maison s’il pleut.']}),
    write(1,'우리에게 시간이 있으면 우리는 갈 거야.','Si nous avons le temps, nous irons.','nous의 현재형 avons와 미래형 irons를 구분해요.',{accepted:['Nous irons si nous avons le temps.']}),
    write(5,'네가 오면 우리는 집에서 먹을 거야.','Si tu viens, nous mangerons à la maison.','si 뒤에는 viens, 결과에는 mangerons를 써요.',{glossary:'à la maison = 집에서',accepted:['Nous mangerons à la maison si tu viens.']}),
    write(10,'산책 계획이에요: 날씨가 좋으면 나는 걸을 거야.','S’il fait beau, je marcherai.','날씨 조건은 현재형, 걷겠다는 결과는 단순미래예요.',{accepted:['Je marcherai s’il fait beau.']}),
    write(1,'약속을 잡아요: 시간이 있으면 나는 올 거야.','Si j’ai le temps, je viendrai.','venir의 단순미래 어간은 viendr-예요.',{glossary:'venir = 오다 · 미래 어간 viendr-',accepted:['Je viendrai si j’ai le temps.']}),
    write(2,'비 오는 날의 계획이에요: 비가 오면 우리는 읽을 거야.','S’il pleut, nous lirons.','lire의 미래 어간 lir-에 -ons를 붙여요.',{glossary:'lire = 읽다 · 미래 어간 lir-',accepted:['Nous lirons s’il pleut.']}),
    write(1,'일정을 조정해요: 네가 시간이 있으면 우리는 이 일을 할 거야.','Si tu as le temps, nous ferons ce travail.','조건은 tu as, 결과는 nous ferons예요.',{glossary:'faire = 하다 · 미래 어간 fer- · ce travail = 이 일',accepted:['Nous ferons ce travail si tu as le temps.']}),
    write(2,'외출 계획을 바꿔요: 비가 오면 우리는 외출하지 않을 거야.','S’il pleut, nous ne sortirons pas.','sortir의 nous 미래형 sortirons를 ne … pas로 감싸요.',{glossary:'sortir = 외출하다',accepted:['Nous ne sortirons pas s’il pleut.']})
  ],
  'imagined-conditions': [
    blank(1,'그녀에게 시간이 있다면 그녀는 여행할 텐데.','Si elle ___ le temps, elle voyagerait.','avait','Si elle avait le temps, elle voyagerait.','현재와 다른 조건을 상상하므로 si 뒤에 반과거 avait를 써요.'),
    blank(2,'시간이 있다면 우리는 더 읽을 텐데.','Si nous avions le temps, nous ___ plus.','lirions','Si nous avions le temps, nous lirions plus.','가정의 결과는 조건법 lirions예요.'),
    arrange(4,'우리가 부자라면 여행할 텐데.','Si nous étions riches, nous voyagerions.','반과거 étions과 조건법 voyagerions를 연결해요.',{glossary:'riche = 부유한',accepted:['Nous voyagerions si nous étions riches.']}),
    write(5,'그녀에게 시간이 있다면 그녀는 갈 텐데.','Si elle avait le temps, elle irait.','elle의 반과거 avait와 aller의 조건법 irait를 써요.',{accepted:['Elle irait si elle avait le temps.']}),
    write(7,'내가 너라면 떠나지 않을 텐데.','Si j’étais toi, je ne partirais pas.','조언의 조건은 étais, 결과는 조건법 partirais예요.',{glossary:'partir = 떠나다',accepted:['Je ne partirais pas si j’étais toi.']}),
    write(1,'여유 있는 삶을 상상해요: 시간이 있다면 우리는 여행할 텐데.','Si nous avions le temps, nous voyagerions.','nous에 맞춘 avions와 voyagerions를 써요.',{accepted:['Nous voyagerions si nous avions le temps.']}),
    write(7,'친구에게 조언해요: 내가 너라면 집에 머무를 텐데.','Si j’étais toi, je resterais à la maison.','rester의 조건법 resterais 뒤에 장소를 붙여요.',{glossary:'à la maison = 집에',accepted:['Je resterais à la maison si j’étais toi.']}),
    write(8,'할 수 없는 일을 상상해요: 시간이 있다면 우리는 그것을 할 텐데.','Si nous avions le temps, nous le ferions.','목적어 le는 조건법 ferions 앞에 놓아요.',{glossary:'faire의 조건법 어간 = fer- · le = 그것을',accepted:['Nous le ferions si nous avions le temps.']}),
    write(2,'독서 시간을 상상해요: 시간이 있다면 그녀는 더 읽을 텐데.','Si elle avait le temps, elle lirait plus.','elle에 맞는 조건법은 lirait예요.',{accepted:['Elle lirait plus si elle avait le temps.']}),
    write(5,'여행할 여유를 상상해요: 시간이 있다면 나는 파리에 갈 텐데.','Si j’avais le temps, j’irais à Paris.','aller의 je 조건법은 irais예요. 미래형 irai와 구분해요.',{accepted:['J’irais à Paris si j’avais le temps.']})
  ],
  'object-pronouns': [
    blank(1,'너는 그것을 읽어. (le livre를 대명사로)','Tu ___ lis.','le','Tu le lis.','남성 단수 직접목적어 le livre는 le로 받아 동사 앞에 놓아요.',{glossary:'tu lis = 너는 읽는다'}),
    blank(5,'나는 그것을 사고 싶어. (la salade를 대명사로)','Je veux ___ acheter.','l’','Je veux l’acheter.','직접목적어 la는 모음 앞에서 l’가 되어 acheter 바로 앞에 놓여요.'),
    arrange(7,'나는 그것을 읽지 않아. (le livre를 대명사로)','Je ne le lis pas.','ne + le + lis + pas 순서예요.'),
    write(1,'그녀는 그것들을 읽어. (les livres를 대명사로)','Elle les lit.','복수 목적어 les를 elle의 현재형 lit 앞에 놓아요.',{glossary:'elle lit = 그녀는 읽는다'}),
    write(8,'나는 그것을 좋아해. (le café를 대명사로)','Je l’aime.','le는 모음으로 시작하는 aime 앞에서 l’로 줄어요.'),
    write(5,'책 이야기를 해요: 나는 그것을 읽고 싶어. (le livre를 대명사로)','Je veux le lire.','목적어 le는 읽는 행동의 동사원형 lire 바로 앞에 놓아요.'),
    write(7,'메뉴를 보고 말해요: 나는 그것을 좋아하지 않아. (la salade를 대명사로)','Je ne l’aime pas.','la는 aime 앞에서 l’가 되고, ne … pas가 동사를 감싸요.'),
    write(5,'여러 책을 골랐어요: 나는 그것들을 사고 싶어. (les livres를 대명사로)','Je veux les acheter.','복수 les는 줄이지 않고 acheter 앞에 놓아요.'),
    write(1,'영화 이야기를 해요: 우리는 그것을 봐. (le film을 대명사로, regarder)','Nous le regardons.','le를 nous의 현재형 regardons 앞에 놓아요.',{glossary:'nous regardons = 우리는 본다'}),
    write(5,'이 책을 오늘 읽을 수 있어요: 나는 그것을 읽을 수 있어. (대명사로)','Je peux le lire.','목적어 le는 peux 앞이 아니라 동사원형 lire 앞에 놓아요.',{glossary:'le livre = 그 책 · pouvoir = ~할 수 있다'})
  ],
  'place-quantity': [
    blank(1,'우리는 그곳에서 일해. (장소를 대명사로)','Nous ___ travaillons.','y','Nous y travaillons.','앞에서 나온 장소는 y로 받아 활용된 동사 앞에 놓아요.'),
    blank(3,'그녀는 그것을 두 개 가지고 있어. (des livres를 대명사로)','Elle ___ a deux.','en','Elle en a deux.','명사는 en으로 받고 수량 deux는 남겨요.',{glossary:'elle a = 그녀는 가지고 있다'}),
    arrange(7,'나는 그것을 가지고 있지 않아. (des livres를 대명사로)','Je n’en ai pas.','부정문에서는 n’ + en + ai + pas 순서로 써요.'),
    write(1,'나는 그곳에 가지 않아. (장소를 대명사로)','Je n’y vais pas.','y는 vais 앞에 놓고 ne는 n’로 줄여요.'),
    write(3,'나는 그것을 세 개 가지고 있어. (des livres를 대명사로)','J’en ai trois.','en 뒤의 동사 ai 다음에 수량 trois를 남겨요.',{glossary:'trois = 셋'}),
    write(4,'그 카페에 가려고 해요: 우리는 그곳에 가고 싶어. (대명사로)','Nous voulons y aller.','y는 동사원형 aller 바로 앞에 놓아요.',{glossary:'nous voulons = 우리는 원한다'}),
    write(8,'물을 마시는 중이에요: 나는 그것을 마셔. (de l’eau를 대명사로)','J’en bois.','부분관사 표현 de l’eau는 en으로 받고 boire는 bois로 활용해요.',{glossary:'je bois = 나는 마신다'}),
    write(7,'차를 거절해요: 나는 그것을 마시지 않아. (du thé를 대명사로)','Je n’en bois pas.','du thé를 en으로 받는 부정문은 n’en bois pas예요.'),
    write(1,'친구의 직장을 말해요: 그는 그곳에서 일해. (장소를 대명사로)','Il y travaille.','장소를 받는 y는 travaille 앞에 놓아요.'),
    write(4,'가고 싶지 않은 장소예요: 나는 그곳에 가고 싶지 않아. (대명사로)','Je ne veux pas y aller.','부정은 veux를 감싸고 y는 aller 앞에 남겨요.')
  ],
  'relative-links': [
    blank(1,'나는 여기서 요리하는 친구 한 명이 있어.','J’ai un ami ___ cuisine ici.','qui','J’ai un ami qui cuisine ici.','요리하는 주체가 앞의 ami이므로 qui를 써요.',{glossary:'cuisiner = 요리하다'}),
    blank(2,'이건 내가 보는 영화야.','C’est le film ___ je regarde.','que','C’est le film que je regarde.','regarde의 주어는 je, 영화는 보는 대상이므로 que를 써요.'),
    arrange(5,'이건 그녀가 좋아하는 카페야.','C’est le café qu’elle aime.','카페는 aime의 목적어예요. que는 elle 앞에서 qu’로 줄어요.'),
    write(1,'나는 파리에 사는 친구 한 명이 있어.','J’ai un ami qui habite à Paris.','사는 주체가 ami이므로 qui를 써요. 모음 앞에서도 qui는 유지해요.',{accepted:['J’ai une amie qui habite à Paris.']}),
    write(2,'이건 내가 보는 영화야.','C’est le film que je regarde.','le film 뒤에 주어 je가 있는 관계절 que je regarde를 붙여요.'),
    write(1,'친구를 소개해요: 나는 여기서 읽고 있는 친구 한 명이 있어.','J’ai un ami qui lit ici.','lire의 il 현재형 lit 앞에서 qui가 주어 역할을 해요.',{glossary:'il lit = 그는 읽는다',accepted:['J’ai une amie qui lit ici.']}),
    write(5,'친구가 보는 영화를 가리켜요: 이건 그녀가 보는 영화야.','C’est le film qu’elle regarde.','직접목적어 역할의 que를 elle 앞에서 qu’로 줄여요.'),
    write(1,'일하는 친구를 소개해요: 나는 파리에서 일하는 친구 한 명이 있어.','J’ai un ami qui travaille à Paris.','행동의 주체인 ami와 travaille를 qui로 연결해요.',{accepted:['J’ai une amie qui travaille à Paris.']}),
    write(5,'친구의 책을 가리켜요: 이건 그녀가 좋아하는 책이야.','C’est le livre qu’elle aime.','책은 좋아하는 대상이므로 que를 쓰고 elle 앞에서 줄여요.'),
    write(1,'친구의 직장을 말해요: 나는 리옹에서 일하는 친구 한 명이 있어.','J’ai un ami qui travaille à Lyon.','일하는 사람을 설명하므로 qui가 travaille의 주어가 돼요.',{glossary:'Lyon = 리옹',accepted:['J’ai une amie qui travaille à Lyon.']})
  ],
  comparisons: [
    blank(1,'이 방은 저 방보다 더 커.','Cette chambre est ___ grande que celle-là.','plus','Cette chambre est plus grande que celle-là.','더 큰 정도는 plus로, 여성 명사 chambre의 크기는 grande로 표현해요.'),
    blank(6,'이 샐러드가 더 맛있어.','Cette salade est ___.','meilleure','Cette salade est meilleure.','여성 단수 salade에 맞춰 meilleure를 써요.'),
    arrange(4,'이 방은 저 방만큼 조용해.','Cette chambre est aussi calme que celle-là.','같은 정도는 aussi … que로 나타내요.'),
    write(2,'이 책은 저 책보다 덜 비싸.','Ce livre est moins cher que celui-là.','남성 명사 livre를 celui-là로 받고 moins cher로 비교해요.'),
    write(5,'그는 나보다 프랑스어를 더 잘해.','Il parle mieux français que moi.','말하는 행동의 비교급은 mieux예요. 남성형·여성형으로 바꾸지 않아요.'),
    write(8,'책을 비교해요: 이 책이 더 좋아.','Ce livre est meilleur.','남성 단수 livre에 맞춰 meilleur를 써요.'),
    write(6,'음식을 비교해요: 이 샐러드들이 더 맛있어.','Ces salades sont meilleures.','여성 복수 salades에 맞춰 meilleures로 써요.'),
    write(2,'숙소를 비교해요: 이 방은 저 방보다 덜 비싸.','Cette chambre est moins chère que celle-là.','여성형 chère와 celle-là를 써요.',{glossary:'cher / chère = 비싼'}),
    write(7,'실력이 늘었어요: 그녀는 전보다 더 잘 이해해.','Elle comprend mieux qu’avant.','comprendre의 elle 현재형 comprend와 부사 mieux를 써요.',{glossary:'elle comprend = 그녀는 이해한다'}),
    write(4,'가격이 같은 두 가방이에요: 이 가방은 저 가방만큼 비싸.','Ce sac est aussi cher que celui-là.','같은 정도의 가격을 aussi cher que로 비교해요.')
  ],
  'opinion-links': [
    blank(1,'배고파서 나는 먹어.','Je mange ___ j’ai faim.','parce que','Je mange parce que j’ai faim.','먹는 이유를 parce que로 이어줘요. j’ 앞에서는 줄이지 않아요.'),
    blank(3,'나는 시간이 있어. 그래서 나는 와.','J’ai le temps, ___ je viens.','donc','J’ai le temps, donc je viens.','앞 내용의 결과는 donc로 이어줘요.',{glossary:'je viens = 나는 온다'}),
    arrange(5,'나는 피곤해. 그런데도 나는 일해.','Je suis fatigué, pourtant je travaille.','예상과 다른 결과를 pourtant로 연결해요.',{accepted:['Je suis fatiguée, pourtant je travaille.','Je suis fatigué, je travaille pourtant.','Je suis fatiguée, je travaille pourtant.']}),
    write(1,'목말라서 나는 마셔.','Je bois parce que j’ai soif.','목마름은 마시는 이유예요. parce que로 연결해요.',{glossary:'je bois = 나는 마신다',accepted:['Parce que j’ai soif, je bois.']}),
    write(6,'나는 이게 유용하다고 생각해.','Je pense que c’est utile.','Je pense que 뒤에 의견의 내용을 직설법으로 붙여요.',{glossary:'utile = 유용한'}),
    write(9,'외출하지 않는 이유예요: 피곤해서 나는 집에 머물러. (parce que)','Je reste à la maison parce que je suis fatigué.','이유인 피곤함은 parce que 뒤에 붙여요.',{accepted:['Je reste à la maison parce que je suis fatiguée.','Parce que je suis fatigué, je reste à la maison.','Parce que je suis fatiguée, je reste à la maison.']}),
    write(4,'원인과 결과를 말해요: 나는 배고파. 그래서 나는 먹어. (donc)','J’ai faim, donc je mange.','원인 j’ai faim을 먼저 말하고 donc로 결과를 이어줘요.',{accepted:['J’ai faim, je mange donc.']}),
    write(5,'마음이 달라요: 나는 시간이 있어. 그런데도 나는 외출하지 않아. (pourtant)','J’ai le temps, pourtant je ne sors pas.','예상과 다른 행동을 pourtant로 잇고 sors를 부정해요.',{glossary:'je sors = 나는 외출한다',accepted:['J’ai le temps, je ne sors pourtant pas.']}),
    write(6,'친구의 의견에 동의해요: 나는 그녀가 옳다고 생각해.','Je pense qu’elle a raison.','que는 elle 앞에서 qu’로 줄어요. avoir raison은 “옳다”예요.'),
    write(9,'함께 먹는 이유예요: 나는 배고프기 때문에 여기서 먹어. (parce que)','Je mange ici parce que j’ai faim.','이유를 앞에 두어도 돼요. 장소 ici도 빠뜨리지 않아요.',{accepted:['Parce que j’ai faim, je mange ici.','Ici, je mange parce que j’ai faim.']})
  ],
  necessity: [
    blank(1,'그녀가 와야 해.','Il faut qu’elle ___.','vienne','Il faut qu’elle vienne.','Il faut que 뒤의 venir는 접속법 vienne로 써요.'),
    blank(2,'그가 여기에 있어야 해.','Il faut qu’il ___ ici.','soit','Il faut qu’il soit ici.','être의 il 접속법 현재는 soit예요.'),
    arrange(4,'우리가 이 일을 해야 해.','Il faut que nous fassions ce travail.','faire의 nous 접속법은 fassions예요.'),
    write(1,'네가 와야 해.','Il faut que tu viennes.','tu에 맞는 venir의 접속법은 viennes예요.'),
    write(7,'그녀가 준비되어 있어야 해.','Il faut qu’elle soit prête.','être는 soit로, 여성 단수 상태는 prête로 써요.'),
    write(8,'출발 시간이 다 됐어요: 그들이 떠나야 해. (남성 복수)','Il faut qu’ils partent.','partir의 ils 접속법 현재는 partent예요.'),
    write(5,'친구에게 바람을 말해요: 나는 네가 여기에 오기를 원해.','Je veux que tu viennes ici.','주어가 je에서 tu로 바뀌는 바람은 que와 접속법으로 연결해요.'),
    write(3,'함께 일하자고 해요: 나는 네가 이 일을 하기를 원해.','Je veux que tu fasses ce travail.','faire의 tu 접속법은 fasses예요.'),
    write(10,'친구의 여유를 바라요: 나는 그녀가 시간이 있기를 원해.','Je veux qu’elle ait le temps.','avoir의 elle 접속법은 ait예요. que는 qu’로 줄여요.'),
    write(7,'약속 장소를 정해요: 우리가 여기에 있어야 해.','Il faut que nous soyons ici.','être의 nous 접속법 현재는 soyons예요.')
  ]
};
// Spelling-only alternatives for the authored time expression, never new prompts.
for(const questions of Object.values(reinforcementSpecs))for(const q of questions){
  if(q.full.includes('huit heures'))q.accepted=[...(q.accepted||[]),...[q.full,...(q.accepted||[])].flatMap(text=>['8 heures','8 h','8h'].map(time=>text.replace('huit heures',time)))];
}
