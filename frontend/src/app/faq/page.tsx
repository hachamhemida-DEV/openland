"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "ما هي أوبن لاند؟",
        answer: "أوبن لاند هي أول منصة رقمية جزائرية متخصصة في الأراضي الزراعية، تهدف إلى تسهيل عمليات البيع والكراء والاستثمار في الأراضي الفلاحية بمختلف أنواعها."
    },
    {
        question: "ما هي أنواع الأراضي المتاحة؟",
        answer: "نوفر ثلاثة أنواع من الأراضي: أراضي الدولة (عقود الامتياز)، أراضي الخواص (الأفراد)، والأراضي الوقفية. كل نوع له خصائصه القانونية الخاصة."
    },
    {
        question: "كيف يمكنني إضافة أرضي للبيع؟",
        answer: "قم بالتسجيل في المنصة كبائع، ثم أضف تفاصيل أرضك مع الصور والوثائق. سيقوم فريقنا بمراجعة الإعلان والتحقق منه قبل نشره."
    },
    {
        question: "ما هي تكلفة الخدمة؟",
        answer: "نقدم خدمات متنوعة بأسعار تنافسية. للاطلاع على تفاصيل الأسعار وطرق الدفع، يرجى زيارة صفحة الأسعار أو التواصل معنا مباشرة."
    },
    {
        question: "ما هي طرق الدفع المتاحة؟",
        answer: "نوفر عدة طرق للدفع لتسهيل المعاملات. تواصل معنا للحصول على تفاصيل طرق الدفع المتاحة والاختيار الأنسب لك."
    },
    {
        question: "ما الذي أدفع مقابله؟",
        answer: "تشمل رسوم الخدمة: نشر الإعلان، التحقق من الوثائق، التسويق للعقار، والوساطة بين البائع والمشتري. تواصل معنا للحصول على تفاصيل كاملة."
    },
    {
        question: "كيف أتواصل مع صاحب الأرض؟",
        answer: "لضمان الشفافية والأمان، يتم التواصل عبر فريق أوبن لاند. اتصل بنا على الرقم المتوفر وسنساعدك في التواصل مع البائع وترتيب زيارة للموقع."
    },
    {
        question: "هل الأراضي المعروضة موثقة؟",
        answer: "نعم، نقوم بالتحقق من جميع الإعلانات قبل نشرها. نطلب من البائعين توفير الوثائق اللازمة لضمان مصداقية المعلومات المعروضة."
    },
    {
        question: "ما هي الولايات المغطاة؟",
        answer: "نغطي جميع الولايات الـ 48 في الجزائر. يمكنك البحث حسب الولاية والبلدية للعثور على الأراضي في منطقتك."
    },
    {
        question: "كيف أعرف الحالة القانونية للأرض؟",
        answer: "كل إعلان يحتوي على معلومات عن نوع الملكية (دولة، خاص، وقف) والوثائق المتوفرة. ننصح دائماً بالتحقق من الوثائق مع المصالح المختصة قبل أي معاملة."
    }
];

function FAQItem({ question, answer, isOpen, onToggle }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            className="bg-white rounded-2xl overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <button
                className="w-full p-6 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                onClick={onToggle}
            >
                <span className="font-bold text-gray-900">{question}</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-sand">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <HelpCircle className="h-8 w-8 text-white" />
                    </motion.div>
                    <motion.h1
                        className="text-3xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        الأسئلة الشائعة
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        إجابات على أكثر الأسئلة شيوعاً حول منصة أوبن لاند
                    </motion.p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-16 md:py-20 px-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-gray-600 mb-4">لم تجد إجابة لسؤالك؟</p>
                    <a href="/contact" className="text-primary font-bold hover:text-primary-dark transition-colors">
                        تواصل معنا مباشرة ←
                    </a>
                </div>
            </section>
        </div>
    );
}
