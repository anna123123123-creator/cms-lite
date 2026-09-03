(function (global) {
  'use strict';
  var STORAGE_KEY = 'cms_lite_data_v1';

  function seed() {
    return {
      settings: {
        siteName: '晨曦企业建站',
        siteDescription: '专注于为中小企业提供简洁、专业的官网展示方案。',
        contactPhone: '400-800-6699',
        contactEmail: 'contact@chenxi-site.example',
      },
      pages: [
        {
          id: 'pg1',
          title: '首页',
          slug: 'home',
          navOrder: 0,
          showInNav: true,
          published: true,
          updatedAt: '2026-08-20',
          content: '欢迎来到晨曦企业建站的官方网站。我们是一家专注于为中小企业打造专业官网的团队，从建站之初就坚持"简洁、高效、可维护"的理念，帮助客户用最低的成本搭建起值得信赖的线上门面。\n\n无论你是刚起步的创业公司，还是希望焕新形象的成熟企业，我们都能提供合适的建站方案：从页面结构规划、内容撰写建议，到上线后的日常维护，全流程一站式服务。\n\n点击导航栏，了解更多关于我们的团队、我们提供的服务、过往案例，或直接联系我们获取免费咨询。',
        },
        {
          id: 'pg2',
          title: '关于我们',
          slug: 'about',
          navOrder: 1,
          showInNav: true,
          published: true,
          updatedAt: '2026-08-18',
          content: '晨曦企业建站成立于 2018 年，是一支由设计师、前端工程师和内容顾问组成的小而精团队。多年来，我们始终专注于一件事：帮助中小企业以合理的价格拥有一个专业、好用的官方网站。\n\n我们的理念很简单——网站不是摆设，而是企业对外沟通的第一窗口。因此在每一个项目中，我们都会花时间了解客户的业务、目标客户群体和真实诉求，而不是简单套用模板。\n\n截至目前，我们已经为超过 300 家企业客户提供过建站与维护服务，覆盖制造业、零售、教育培训、专业服务等多个行业。我们相信，好的网站应该是清晰的信息、顺畅的浏览体验和持续的维护支持三者的结合。',
        },
        {
          id: 'pg3',
          title: '产品服务',
          slug: 'services',
          navOrder: 2,
          showInNav: true,
          published: true,
          updatedAt: '2026-08-25',
          content: '我们提供从建站到运维的全套服务，主要包括以下几个方向：\n\n【企业官网定制】根据企业品牌调性和业务重点，设计并开发专属的企业官网，包含首页、关于我们、产品服务、案例展示、联系方式等标准板块，也支持按需增加自定义页面。\n\n【导航与内容管理】提供简单易用的后台管理系统，企业运营人员无需懂技术即可自主编辑页面内容、调整导航栏目顺序、上下线某个页面，网站维护不再依赖开发人员。\n\n【网站维护与咨询】网站上线后，我们提供持续的技术支持与内容更新建议，包括访问速度优化、移动端适配检查、内容更新提醒等，确保网站始终保持良好状态。\n\n所有服务均可按企业实际规模灵活组合，欢迎联系我们获取具体报价。',
        },
        {
          id: 'pg4',
          title: '案例展示',
          slug: 'cases',
          navOrder: 3,
          showInNav: true,
          published: false,
          updatedAt: '2026-08-10',
          content: '（本页面正在整理最新案例，暂未对外发布）\n\n计划展示内容包括：某精密制造企业官网改版项目、某教育培训机构多校区展示站、某本地连锁餐饮品牌形象站等，涵盖行业介绍、项目难点、解决方案与上线效果四个部分。\n\n页面发布前，此内容仅后台管理员可见，前台导航与直接访问均不会展示本页面，这也是本系统"页面发布状态控制"功能的真实演示之一。',
        },
        {
          id: 'pg5',
          title: '联系我们',
          slug: 'contact',
          navOrder: 4,
          showInNav: true,
          published: true,
          updatedAt: '2026-08-27',
          content: '如果你对我们的建站服务感兴趣，或者想了解更多产品细节，欢迎通过以下方式联系我们：\n\n客服热线：400-800-6699（工作日 9:00-18:00）\n电子邮箱：contact@chenxi-site.example\n公司地址：上海市静安区某某路 88 号晨曦大厦 12 层\n\n我们通常会在 1 个工作日内回复邮件咨询。如果是紧急需求，建议直接拨打客服热线，我们的顾问会第一时间为你解答建站相关问题，并根据你的行业和预算提供初步方案建议。',
        },
        {
          id: 'pg6',
          title: '常见问题',
          slug: 'faq',
          navOrder: 5,
          showInNav: true,
          published: true,
          updatedAt: '2026-08-22',
          content: '【建站大概需要多长时间？】\n标准企业官网从需求确认到上线，通常需要 2-4 周，具体取决于页面数量和内容准备情况。\n\n【网站上线后我们自己能修改内容吗？】\n可以。我们提供的后台管理系统支持自主编辑页面文字、调整导航栏顺序、控制页面是否发布，日常内容更新不需要联系开发人员。\n\n【网站数据存储在哪里？会不会丢失？】\n生产环境网站会部署在正式的服务器和数据库上，配合定期备份机制，不会像本地演示版本那样仅依赖浏览器存储。\n\n【可以绑定自己的域名吗？】\n可以，正式版本支持自定义域名绑定、SSL 证书配置以及基础 SEO 设置，让网站以企业自己的域名对外展示。',
        },
      ],
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var s = seed();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        return s;
      }
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.settings || !parsed.pages) throw new Error('bad data');
      return parsed;
    } catch (e) {
      var s2 = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s2));
      return s2;
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  global.CmsData = {
    load: load,
    save: save,
    uid: uid,
    todayStr: todayStr,
    reset: function () { var s = seed(); save(s); return s; },
  };
})(window);
